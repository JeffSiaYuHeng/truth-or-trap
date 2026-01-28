import { GameState, GameScreen, Language, GameAction, ChallengeType, Card, Difficulty, ExecutionMode } from '../types';

// Helper to create a clean/empty challenge state
const createEmptyChallenge = (): GameState['currentChallenge'] => ({
  type: null,
  text: '',
  originalExecutorIndex: null,
  currentExecutorIndex: null,
  partnerIndex: null,
  executionMode: ExecutionMode.SOLO,
  executorCompleted: false,
  partnerCompleted: false,
});

export const initialState: GameState = {
  players: [],
  difficulty: Difficulty.NORMAL,
  currentScreen: GameScreen.SETUP,
  currentPlayerIndex: null,
  previousPlayerIndex: null,
  currentChallenge: createEmptyChallenge(),
  isLoading: false,
  language: Language.CN,
  isForcedDare: false,
  isPickingPlayer: false,
  isCardModalOpen: false,
  gameMessage: null,
  isStealFailure: false,
  battle: null,
  lastCardAwarded: null,
  // Mirror & Partner UI State
  isSelectingMirrorTarget: false,
  isSelectingPartnerTarget: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload],
      };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload),
      };
    case 'UPDATE_PLAYER_NAME':
      return {
        ...state,
        players: state.players.map(p => p.id === action.payload.id ? { ...p, name: action.payload.name } : p)
      }
    case 'UPDATE_PLAYER_AVATAR':
      return {
        ...state,
        players: state.players.map(p => p.id === action.payload.id ? { ...p, avatar: action.payload.avatar } : p)
      }
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      };
    case 'START_GAME':
      if (state.players.length < 2) return state;
      return {
        ...state,
        currentScreen: GameScreen.GAME,
        isPickingPlayer: true,
        currentPlayerIndex: null,
        currentChallenge: createEmptyChallenge(),
      };
    case 'START_PLAYER_PICKING': {
      const lastPlayerIndex = state.currentPlayerIndex;

      // Chance Event: 35% chance to get a card after completing a challenge.
      if (lastPlayerIndex !== null && state.currentChallenge.text && Math.random() < 0.35) {
        let updatedPlayers = [...state.players];
        const droppableCards: Card[] = [
          Card.BATTLE, Card.BATTLE, Card.BATTLE,        // Uncommon (30%)
          Card.STEAL, Card.STEAL,                       // Uncommon (20%)
          Card.IMMUNITY,                                // Rare (10%)
          Card.KING,                                    // Rarest (10%)
          Card.MIRROR, Card.MIRROR,                     // New: Mirror card (20%)
          Card.PARTNER,                                 // New: Partner card (10%)
        ];
        const randomCard = droppableCards[Math.floor(Math.random() * droppableCards.length)];

        const playerToReward = updatedPlayers[lastPlayerIndex];
        const updatedPlayer = {
          ...playerToReward,
          cards: [...playerToReward.cards, randomCard]
        };
        updatedPlayers[lastPlayerIndex] = updatedPlayer;

        const lastCardAwarded = {
          playerName: playerToReward.name,
          card: randomCard,
        };

        // If a card was awarded, show the popup first. Don't start picking.
        return {
          ...state,
          players: updatedPlayers,
          currentChallenge: createEmptyChallenge(),
          gameMessage: null,
          lastCardAwarded,
          isPickingPlayer: false, // Explicitly set to false
        };
      }

      // If no card was awarded, proceed directly to picking.
      return {
        ...state,
        isPickingPlayer: true,
        currentChallenge: createEmptyChallenge(),
        gameMessage: null,
      };
    }
    case 'NEXT_PLAYER':
      if (state.players.length === 0) return state;
      const newPlayerIndex = Math.floor(Math.random() * state.players.length);
      const isForced = newPlayerIndex === state.currentPlayerIndex;
      const players = state.players.map((p, index) => {
        if (index === newPlayerIndex) {
          return { ...p, consecutiveTurns: isForced ? p.consecutiveTurns + 1 : 1 };
        }
        if (index === state.currentPlayerIndex) {
          return { ...p, consecutiveTurns: 0 };
        }
        return p;
      });
      return {
        ...state,
        previousPlayerIndex: state.currentPlayerIndex,
        currentPlayerIndex: newPlayerIndex,
        currentChallenge: createEmptyChallenge(),
        isForcedDare: players[newPlayerIndex].consecutiveTurns >= 2,
        players,
        gameMessage: null, // Clear previous messages
        isPickingPlayer: false,
      };
    case 'REQUEST_CHALLENGE':
      return {
        ...state,
        isLoading: true,
        currentChallenge: {
          ...createEmptyChallenge(),
          type: action.payload,
          originalExecutorIndex: state.currentPlayerIndex,
          currentExecutorIndex: state.currentPlayerIndex,
        },
      };
    case 'RECEIVE_CHALLENGE': {
      if (state.currentPlayerIndex === null) {
        return state;
      }

      const currentPlayerId = state.players[state.currentPlayerIndex].id;
      let gameMessage: GameState['gameMessage'] = state.gameMessage;

      const updatedPlayers = state.players.map(player => {
        // Only modify the current player.
        if (player.id !== currentPlayerId) {
          return player;
        }

        // Create a new player object for immutable update.
        let updatedPlayer = { ...player };

        if (action.payload.type === ChallengeType.DARE) {
          const newDareStreak = updatedPlayer.dareStreak + 1;
          if (newDareStreak >= 3) {
            gameMessage = { key: 'dareStreak' };
            updatedPlayer = {
              ...updatedPlayer,
              cards: [...updatedPlayer.cards, Card.IMMUNITY],
              dareStreak: 0,
            };
          } else {
            updatedPlayer = {
              ...updatedPlayer,
              dareStreak: newDareStreak,
            };
          }
        } else {
          // TRUTH: Reset the player's dare streak.
          updatedPlayer = {
            ...updatedPlayer,
            dareStreak: 0,
          };
        }

        return updatedPlayer;
      });

      return {
        ...state,
        isLoading: false,
        isStealFailure: false,
        currentChallenge: {
          ...state.currentChallenge,
          type: action.payload.type,
          text: action.payload.text,
        },
        players: updatedPlayers,
        gameMessage,
      };
    }
    case 'CHALLENGE_FAIL':
      return {
        ...state,
        isLoading: false,
        currentChallenge: { ...state.currentChallenge, text: 'geminiError' }
      }
    case 'OPEN_CARD_MODAL':
      return { ...state, isCardModalOpen: true };
    case 'CLOSE_CARD_MODAL':
      return { ...state, isCardModalOpen: false, battle: null };
    case 'USE_CARD': {
      if (state.currentPlayerIndex === null) return state;

      const playerIndex = state.currentPlayerIndex;
      const player = state.players[playerIndex];
      const cardToUse = action.payload.card;

      const cardIndex = player.cards.indexOf(cardToUse);
      if (cardIndex === -1) return state;

      const updatedCards = [...player.cards];
      updatedCards.splice(cardIndex, 1);

      const updatedPlayers = [...state.players];
      let updatedPlayer = { ...player, cards: updatedCards };

      let nextState = { ...state, isCardModalOpen: false };

      switch (cardToUse) {
        case Card.IMMUNITY: {
          updatedPlayers[playerIndex] = updatedPlayer;
          return {
            ...nextState,
            players: updatedPlayers,
            isPickingPlayer: true,
            currentPlayerIndex: null, // Picker animation will select next player
            currentChallenge: createEmptyChallenge(),
            gameMessage: { key: 'immunityUsed' },
          };
        }
        case Card.MIRROR: {
          // Open target selection for Mirror (don't consume card yet)
          return {
            ...state,
            isCardModalOpen: false,
            isSelectingMirrorTarget: true,
          };
        }
        case Card.PARTNER: {
          // Open target selection for Partner (don't consume card yet)
          return {
            ...state,
            isCardModalOpen: false,
            isSelectingPartnerTarget: true,
          };
        }
        default:
          // For cards that open another modal (King, Battle, Steal), we don't change players yet.
          // The state change will be handled by their respective modals.
          // We just need to ensure the card is removed.
          updatedPlayers[playerIndex] = updatedPlayer;
          return { ...nextState, players: updatedPlayers };
      }
    }
    case 'SET_CUSTOM_CHALLENGE': {
      if (state.currentPlayerIndex === null) return state;

      const kingPlayerIndex = state.currentPlayerIndex;
      const kingPlayer = state.players[kingPlayerIndex];
      const targetPlayerIndex = state.players.findIndex(p => p.id === action.payload.targetPlayerId);

      if (targetPlayerIndex === -1) return state;

      const targetPlayer = state.players[targetPlayerIndex];

      const kingCardIndex = kingPlayer.cards.indexOf(Card.KING);
      if (kingCardIndex === -1) return state;

      const updatedKingCards = [...kingPlayer.cards];
      updatedKingCards.splice(kingCardIndex, 1);

      const updatedPlayers = [...state.players];
      updatedPlayers[kingPlayerIndex] = { ...kingPlayer, cards: updatedKingCards };

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: targetPlayerIndex,
        currentChallenge: {
          ...createEmptyChallenge(),
          type: action.payload.challengeType,
          text: action.payload.challengeText,
          originalExecutorIndex: kingPlayerIndex,
          currentExecutorIndex: targetPlayerIndex,
        },
        gameMessage: { key: 'kingUsed', options: { kingName: kingPlayer.name, targetName: targetPlayer.name } },
        isCardModalOpen: false,
        isPickingPlayer: false,
        isForcedDare: false,
        isLoading: false,
      }
    }
    case 'START_BATTLE': {
      if (state.currentPlayerIndex === null) return state;
      const challenger = state.players[state.currentPlayerIndex];
      const opponent = state.players.find(p => p.id === action.payload.opponentId);
      if (!opponent) return state;

      const challengerCardIndex = challenger.cards.indexOf(Card.BATTLE);
      if (challengerCardIndex === -1) return state;

      const updatedPlayers = [...state.players];
      const updatedChallenger = { ...challenger, cards: [...challenger.cards] };
      updatedChallenger.cards.splice(challengerCardIndex, 1);
      updatedPlayers[state.currentPlayerIndex] = updatedChallenger;

      return {
        ...state,
        players: updatedPlayers,
        battle: { challenger, opponent },
        isCardModalOpen: false,
      };
    }
    case 'END_BATTLE': {
      const loserIndex = state.players.findIndex(p => p.id === action.payload.loserId);
      if (loserIndex === -1) return state;

      return {
        ...state,
        battle: null,
        currentPlayerIndex: loserIndex,
        currentChallenge: createEmptyChallenge(),
        isForcedDare: true, // Force a dare for the loser
        gameMessage: { key: 'battleLoser', options: { name: state.players[loserIndex].name } },
      }
    }
    case 'ATTEMPT_STEAL': {
      if (state.currentPlayerIndex === null) return state;
      const stealerIndex = state.currentPlayerIndex;
      const stealer = state.players[stealerIndex];
      const targetIndex = state.players.findIndex(p => p.id === action.payload.targetId);
      if (targetIndex === -1) return state;

      const target = state.players[targetIndex];

      const stealerCardIndex = stealer.cards.indexOf(Card.STEAL);
      if (stealerCardIndex === -1) return state; // Should not happen

      const updatedPlayers = [...state.players];

      const updatedStealer = { ...stealer, cards: [...stealer.cards] };
      updatedStealer.cards.splice(stealerCardIndex, 1);

      const success = Math.random() < 0.75;
      let gameMessage: GameState['gameMessage'];

      if (success) {
        const immunityCardIndex = target.cards.indexOf(Card.IMMUNITY);
        if (immunityCardIndex !== -1) {
          const updatedTarget = { ...target, cards: [...target.cards] };
          updatedTarget.cards.splice(immunityCardIndex, 1);
          updatedStealer.cards.push(Card.IMMUNITY);
          updatedPlayers[targetIndex] = updatedTarget;
          gameMessage = { key: 'stealSuccess', options: { name: target.name } };
        } else {
          gameMessage = { key: 'noOneToStealFrom' };
        }
      } else {
        gameMessage = { key: 'stealFail' };
        updatedPlayers[stealerIndex] = updatedStealer;
        return {
          ...state,
          players: updatedPlayers,
          gameMessage,
          isStealFailure: true,
          isCardModalOpen: false,
        }
      }

      updatedPlayers[stealerIndex] = updatedStealer;

      return {
        ...state,
        players: updatedPlayers,
        gameMessage,
        isCardModalOpen: false,
      }
    }
    case 'RESET_GAME':
      return {
        ...initialState,
        language: state.language,
      };
    case 'CLEAR_CARD_AWARD':
      return {
        ...state,
        lastCardAwarded: null,
        isPickingPlayer: true,
      }
    case 'SET_GAME_MESSAGE':
      return { ...state, gameMessage: action.payload };

    // ==================== MIRROR CARD ACTIONS ====================
    case 'OPEN_MIRROR_TARGET_SELECT':
      return { ...state, isSelectingMirrorTarget: true, isCardModalOpen: false };

    case 'CLOSE_MIRROR_TARGET_SELECT':
      return { ...state, isSelectingMirrorTarget: false };

    case 'APPLY_MIRROR_EFFECT': {
      if (state.currentPlayerIndex === null) return state;

      const mirrorUserIndex = state.currentPlayerIndex;
      const mirrorUser = state.players[mirrorUserIndex];
      const targetIndex = state.players.findIndex(p => p.id === action.payload.targetId);

      if (targetIndex === -1) return state;

      // Validation: Cannot use Mirror in 1v1 (need at least 2 other players)
      if (state.players.length <= 2) {
        return {
          ...state,
          isSelectingMirrorTarget: false,
          gameMessage: { key: 'mirrorFail1v1' },
        };
      }

      // Find and consume the Mirror card
      const mirrorCardIndex = mirrorUser.cards.indexOf(Card.MIRROR);
      if (mirrorCardIndex === -1) return state;

      const updatedCards = [...mirrorUser.cards];
      updatedCards.splice(mirrorCardIndex, 1);

      const updatedPlayers = [...state.players];
      updatedPlayers[mirrorUserIndex] = { ...mirrorUser, cards: updatedCards };

      const targetPlayer = state.players[targetIndex];

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: targetIndex, // Switch focus to new target
        currentChallenge: {
          ...state.currentChallenge,
          currentExecutorIndex: targetIndex,
        },
        isSelectingMirrorTarget: false,
        gameMessage: {
          key: 'mirrorUsed',
          options: {
            fromName: mirrorUser.name,
            toName: targetPlayer.name
          }
        },
      };
    }

    // ==================== PARTNER CARD ACTIONS ====================
    case 'OPEN_PARTNER_TARGET_SELECT':
      return { ...state, isSelectingPartnerTarget: true, isCardModalOpen: false };

    case 'CLOSE_PARTNER_TARGET_SELECT':
      return { ...state, isSelectingPartnerTarget: false };

    case 'APPLY_PARTNER_EFFECT': {
      if (state.currentPlayerIndex === null) return state;

      const partnerUserIndex = state.currentPlayerIndex;
      const partnerUser = state.players[partnerUserIndex];
      const targetIndex = state.players.findIndex(p => p.id === action.payload.targetId);

      if (targetIndex === -1) return state;

      // Find and consume the Partner card
      const partnerCardIndex = partnerUser.cards.indexOf(Card.PARTNER);
      if (partnerCardIndex === -1) return state;

      const updatedCards = [...partnerUser.cards];
      updatedCards.splice(partnerCardIndex, 1);

      const updatedPlayers = [...state.players];
      updatedPlayers[partnerUserIndex] = { ...partnerUser, cards: updatedCards };

      const targetPlayer = state.players[targetIndex];

      return {
        ...state,
        players: updatedPlayers,
        currentChallenge: {
          ...state.currentChallenge,
          partnerIndex: targetIndex,
          executionMode: ExecutionMode.SHARED,
        },
        isSelectingPartnerTarget: false,
        gameMessage: {
          key: 'partnerLinked',
          options: {
            initiatorName: partnerUser.name,
            partnerName: targetPlayer.name
          }
        },
      };
    }

    case 'COMPLETE_PARTNER_TURN': {
      // Mark the partner's portion as complete (used when partner confirms completion)
      return {
        ...state,
        currentChallenge: {
          ...state.currentChallenge,
          partnerCompleted: true,
        },
      };
    }

    default:
      return state;
  }
}
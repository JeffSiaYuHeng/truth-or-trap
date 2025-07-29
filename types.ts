import type { Dispatch } from 'react';

export enum Language {
  EN = 'en',
  CN = 'cn',
  MY = 'my',
}

export enum GameMode {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum Difficulty {
  SIMPLE = 'simple',
  NORMAL = 'normal',
  EXTREME = 'extreme',
}

export enum GameScreen {
    SETUP = 'setup',
    GAME = 'game',
}

export enum ChallengeType {
    TRUTH = 'truth',
    DARE = 'dare',
}

export enum Card {
  IMMUNITY = 'IMMUNITY',       // 免除卡
  INTENSIFY = 'INTENSIFY',   // 加强卡
  REVERSE = 'REVERSE',       // 反转卡
  BATTLE = 'BATTLE',         // 对战卡
  STEAL = 'STEAL',           // 偷取卡
  KING = 'KING',             // 国王卡
}

export enum RPS {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  cards: Card[];
  dareStreak: number;
  consecutiveTurns: number;
}

export interface GameMessage {
  key: string;
  options?: Record<string, string | number>;
}

export interface BattleState {
  challenger: Player;
  opponent: Player;
}

export interface GameState {
  players: Player[];
  gameMode: GameMode;
  difficulty: Difficulty;
  currentScreen: GameScreen;
  currentPlayerIndex: number | null;
  previousPlayerIndex: number | null;
  currentChallenge: {
    type: ChallengeType | null;
    text: string;
  };
  isLoading: boolean;
  language: Language;
  isForcedDare: boolean;
  isPickingPlayer: boolean;
  isCardModalOpen: boolean;
  isNextChallengeIntensified: boolean;
  gameMessage: GameMessage | null;
  isStealFailure: boolean;
  battle: BattleState | null;
  lastCardAwarded: { playerName: string; card: Card } | null;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'UPDATE_PLAYER_NAME'; payload: { id: string, name: string } }
  | { type: 'UPDATE_PLAYER_AVATAR'; payload: { id: string, avatar: string } }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_GAME_MODE'; payload: GameMode }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'START_GAME' }
  | { type: 'START_PLAYER_PICKING' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'REQUEST_CHALLENGE'; payload: ChallengeType }
  | { type: 'RECEIVE_CHALLENGE'; payload: { type: ChallengeType, text: string } }
  | { type: 'CHALLENGE_FAIL' }
  | { type: 'COMPLETE_TURN' }
  | { type: 'ADD_CARD_TO_PLAYER'; payload: { playerId: string; card: Card } }
  | { type: 'REMOVE_CARD_FROM_PLAYER'; payload: { playerId: string; card: Card } }
  | { type: 'OPEN_CARD_MODAL' }
  | { type: 'CLOSE_CARD_MODAL' }
  | { type: 'USE_CARD'; payload: { card: Card } }
  | { type: 'SET_CUSTOM_CHALLENGE'; payload: { challengeText: string; challengeType: ChallengeType; targetPlayerId: string; } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_MESSAGE'; payload: GameMessage | null }
  | { type: 'START_BATTLE'; payload: { opponentId: string } }
  | { type: 'END_BATTLE'; payload: { loserId: string } }
  | { type: 'ATTEMPT_STEAL'; payload: { targetId: string } }
  | { type: 'CLEAR_CARD_AWARD' };

export interface LocalizationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, options?: Record<string, string | number>) => string;
}

export interface AppContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}
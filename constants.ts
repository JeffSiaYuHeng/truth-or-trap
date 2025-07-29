import { Card, Language } from './types';

export const AVATARS: string[] = [
  '🥳', '😎', '😜', '😇', '😈', '😂', '🥰', '🤩',
  '🤔', '🤯', '😱', '🤡', '👻', '👽', '🤖', '👑'
];

export const CARD_DETAILS: Record<Card, {
    image: string;
    [Language.EN]: { name: string; description: string };
    [Language.CN]: { name: string; description: string };
    [Language.MY]: { name: string; description: string };
}> = {
  [Card.IMMUNITY]: {
    image: '/images/cards/IMMUNITY_CARD.jpg',
    [Language.EN]: { name: 'Immunity Card', description: 'Skip your turn once.' },
    [Language.CN]: { name: '免除卡', description: '跳过你的回合一次。' },
    [Language.MY]: { name: 'Kad Imuniti', description: 'Langkau giliran anda sekali.' },
  },
  [Card.INTENSIFY]: {
    image: '/images/cards/INTENSIFY_CARD.jpg',
    [Language.EN]: { name: 'Intensify Card', description: "Skip your turn and make the next player's challenge harder." },
    [Language.CN]: { name: '加强卡', description: '跳过你的回合，并让下一位玩家的挑战变得更难。' },
    [Language.MY]: { name: 'Kad Intensiti', description: 'Langkau giliran anda dan jadikan cabaran pemain seterusnya lebih sukar.' },
  },
  [Card.REVERSE]: {
    image: '/images/cards/REVERSE_CARD.jpg',
    [Language.EN]: { name: 'Reverse Card', description: 'Push your challenge to the previous player.' },
    [Language.CN]: { name: '反转卡', description: '将你的挑战推给前一位玩家。' },
    [Language.MY]: { name: 'Kad Songsang', description: 'Tolak cabaran anda kepada pemain sebelumnya.' },
  },
  [Card.BATTLE]: {
    image: '/images/cards/BATTLE_CARD.jpg',
    [Language.EN]: { name: 'Battle Card', description: 'Challenge a player to rock-paper-scissors. Loser does the dare.' },
    [Language.CN]: { name: '对战卡', description: '与一名玩家进行剪刀石头布对决，输家接受惩罚。' },
    [Language.MY]: { name: 'Kad Pertarungan', description: "Cabar pemain untuk 'o-som'. Yang kalah melakukan cabaran." },
  },
  [Card.STEAL]: {
    image: '/images/cards/STEAL_CARD.jpg',
    [Language.EN]: { name: 'Steal Card', description: 'Attempt to steal a card from another player (75% chance).' },
    [Language.CN]: { name: '偷取卡', description: '尝试从另一名玩家那里偷取一张卡（75%成功率）。' },
    [Language.MY]: { name: 'Kad Curi', description: 'Cuba curi kad dari pemain lain (peluang 75%).' },
  },
  [Card.KING]: {
    image: '/images/cards/KING_CARD.jpg',
    [Language.EN]: { name: 'King Card', description: 'Create your own custom truth or dare for any player.' },
    [Language.CN]: { name: '国王卡', description: '为你自己或任何玩家创建一个自定义的真心话或大冒险。' },
    [Language.MY]: { name: 'Kad Raja', description: "Cipta cabaran 'Truth or Dare' anda sendiri untuk mana-mana pemain." },
  },
};
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
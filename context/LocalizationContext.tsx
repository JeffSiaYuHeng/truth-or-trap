import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Language, LocalizationContextType, Card } from '../types';
import { CARD_DETAILS } from '../constants';

const translations: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    title: 'Truth or Trap',
    players: 'Players',
    addPlayer: 'Add Player',
    playerName: 'Player Name',
    gameMode: 'Game Mode',
    privateMode: '🛏️ Private Room',
    privateModeDesc: 'Cozy and personal questions for indoors.',
    publicMode: '🏙️ Public Challenge',
    publicModeDesc: 'Daring challenges for the great outdoors.',
    difficulty: 'Difficulty',
    simple: '😌 Simple',
    simpleDesc: 'Light & fun. Perfect for warming up.',
    normal: '😬 Normal',
    normalDesc: 'The classic experience. A balanced mix.',
    extreme: '🔥 Extreme',
    extremeDesc: 'Push your limits! For the truly brave.',
    startGame: 'Start Game',
    continueGame: 'Continue Game',
    newGame: 'New Game',
    truth: '🤐 Truth',
    dare: '😈 Dare',
    nextPlayer: 'Next Player',
    whosNext: 'Who\'s next?',
    turn: 'It\'s your turn,',
    forcedDare: '2x in a row! Forced Dare!',
    useCard: 'Use Card',
    passTurn: 'Pass Turn',
    dareStreak: '3 Dares in a row! You get an Immunity Card!',
    cardObtained: 'Card Obtained!',
    chanceCardAwarded: 'Lucky! {playerName} received a {cardName}!',
    error: 'Error',
    geminiError: 'Could not get a challenge. Please try again.',
    loadingChallenge: 'Generating challenge...',
    resetGame: 'Reset Game',
    playerIsPicking: 'Deciding who is next...',
    myCards: 'My Cards',
    use: 'Use',
    close: 'Close',
    noCards: 'You have no cards.',
    immunityUsed: 'Immunity card used. Turn skipped!',
    intensifyUsed: 'Intensify Card used! Your turn is skipped and the next challenge will be harder.',
    reverseUsed: "{userName} used a Reverse Card! The challenge is now on {previousPlayerName}!",
    kingUsed: '{kingName} used a King Card on {targetName}!',
    kingCardTitle: "King's Decree",
    targetPlayer: 'Target Player',
    selectPlayer: 'Select a player...',
    challengeText: 'Challenge Text',
    customChallengePlaceholder: 'e.g., Sing the national anthem backwards',
    setTheChallenge: 'Set the Challenge',
    challengeType: 'Challenge Type',
    // Steal Card
    stealTitle: "Steal an Immunity Card",
    selectStealTarget: "Who are you stealing from?",
    steal: "Steal",
    stealSuccess: "Success! You stole an Immunity Card from {name}!",
    stealFail: "Failure! You were caught. Now you must face a hard challenge.",
    noOneToStealFrom: "No one has an Immunity Card to steal.",
    // Battle Card
    battleTitle: "Battle!",
    selectOpponent: "Select Opponent",
    challengePlayer: "Challenge",
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors",
    chooseYourWeapon: "{name}, choose your weapon!",
    reveal: "Reveal!",
    battleWinner: "{name} wins the duel!",
    battleLoser: "{name} loses and must face a challenge!",
    battleDraw: "It's a draw! Go again!",
    waitingForPlayer: "Waiting for {name}...",
    battleResult: "Battle Result",
    continue: "Continue",
  },
  [Language.CN]: {
    title: '真心话大冒险陷阱',
    players: '玩家',
    addPlayer: '添加玩家',
    playerName: '玩家姓名',
    gameMode: '游戏模式',
    privateMode: '🛏️ 私人房间',
    privateModeDesc: '适合室内的私密问题。',
    publicMode: '🏙️ 公共挑战',
    publicModeDesc: '适合户外的冒险挑战。',
    difficulty: '游戏难度',
    simple: '😌 简单',
    simpleDesc: '轻松有趣，适合热身。',
    normal: '😬 普通',
    normalDesc: '经典体验，平衡的组合。',
    extreme: '🔥 极限',
    extremeDesc: '挑战极限，为真正的勇者准备。',
    startGame: '开始游戏',
    continueGame: '继续游戏',
    newGame: '新游戏',
    truth: '🤐 真心话',
    dare: '😈 大冒险',
    nextPlayer: '下一个玩家',
    whosNext: '轮到谁了？',
    turn: '轮到你了,',
    forcedDare: '连续两次！强制大冒险！',
    useCard: '使用卡牌',
    passTurn: '跳过回合',
    dareStreak: '连续3次大冒险！获得一张免除卡！',
    cardObtained: '获得卡牌！',
    chanceCardAwarded: '幸运！{playerName} 获得了一张 {cardName}！',
    error: '错误',
    geminiError: '无法获取挑战，请重试。',
    loadingChallenge: '正在生成挑战...',
    resetGame: '重置游戏',
    playerIsPicking: '正在决定下一位...',
    myCards: '我的卡牌',
    use: '使用',
    close: '关闭',
    noCards: '你没有任何卡牌。',
    immunityUsed: '已使用免除卡，跳过此回合！',
    intensifyUsed: '已使用加强卡！跳过你的回合，且下一个挑战将更难。',
    reverseUsed: "{userName} 使用了反转卡！现在轮到 {previousPlayerName} 面临挑战！",
    kingUsed: '{kingName} 对 {targetName} 使用了国王卡！',
    kingCardTitle: '国王的旨意',
    targetPlayer: '目标玩家',
    selectPlayer: '选择一个玩家...',
    challengeText: '挑战内容',
    customChallengePlaceholder: '例如：倒着唱国歌',
    setTheChallenge: '设定挑战',
    challengeType: '挑战类型',
    // Steal Card
    stealTitle: "偷取免除卡",
    selectStealTarget: "你要从谁那里偷？",
    steal: "偷取",
    stealSuccess: "成功！你从 {name} 那里偷到了一张免除卡！",
    stealFail: "失败！你被抓住了。现在你必须面对一个困难的挑战。",
    noOneToStealFrom: "没有人有免除卡可以偷。",
    // Battle Card
    battleTitle: "对战！",
    selectOpponent: "选择对手",
    challengePlayer: "挑战",
    rock: "石头",
    paper: "布",
    scissors: "剪刀",
    chooseYourWeapon: "{name}，选择你的武器！",
    reveal: "揭晓！",
    battleWinner: "{name} 赢得了对决！",
    battleLoser: "{name} 输了，必须面对挑战！",
    battleDraw: "平局！再来一次！",
    waitingForPlayer: "等待 {name}...",
    battleResult: "对战结果",
    continue: "继续",
  },
  [Language.MY]: {
    title: 'Jujur atau Perangkap',
    players: 'Pemain',
    addPlayer: 'Tambah Pemain',
    playerName: 'Nama Pemain',
    gameMode: 'Mod Permainan',
    privateMode: '🛏️ Bilik Peribadi',
    privateModeDesc: 'Soalan peribadi dan santai untuk dalam rumah.',
    publicMode: '🏙️ Cabaran Awam',
    publicModeDesc: 'Cabaran berani untuk di luar.',
    difficulty: 'Tahap Kesukaran',
    simple: '😌 Mudah',
    simpleDesc: 'Ringan & seronok. Sesuai untuk memanaskan badan.',
    normal: '😬 Biasa',
    normalDesc: 'Pengalaman klasik. Campuran seimbang.',
    extreme: '🔥 Ekstrem',
    extremeDesc: 'Cabar had anda! Untuk yang benar-benar berani.',
    startGame: 'Mula Permainan',
    continueGame: 'Sambung Permainan',
    newGame: 'Permainan Baru',
    truth: '🤐 Jujur',
    dare: '😈 Berani',
    nextPlayer: 'Pemain Seterusnya',
    whosNext: 'Siapa seterusnya?',
    turn: 'Giliran awak,',
    forcedDare: '2x berturut-turut! Cabaran Wajib!',
    useCard: 'Guna Kad',
    passTurn: 'Langkau Giliran',
    dareStreak: '3 Cabaran berturut-turut! Anda dapat Kad Imuniti!',
    cardObtained: 'Dapat Kad!',
    chanceCardAwarded: 'Bertuah! {playerName} menerima sekeping {cardName}!',
    error: 'Ralat',
    geminiError: 'Tidak dapat cabaran. Sila cuba lagi.',
    loadingChallenge: 'Sedang jana cabaran...',
    resetGame: 'Reset Permainan',
    playerIsPicking: 'Memutuskan siapa seterusnya...',
    myCards: 'Kad Saya',
    use: 'Guna',
    close: 'Tutup',
    noCards: 'Anda tidak mempunyai kad.',
    immunityUsed: 'Kad Imuniti digunakan. Giliran dilangkau!',
    intensifyUsed: 'Kad Intensiti digunakan! Giliran anda dilangkau dan cabaran seterusnya akan lebih sukar.',
    reverseUsed: "{userName} menggunakan Kad Songsang! Cabaran kini dialihkan kepada {previousPlayerName}!",
    kingUsed: '{kingName} menggunakan Kad Raja pada {targetName}!',
    kingCardTitle: 'Titah Raja',
    targetPlayer: 'Pemain Sasaran',
    selectPlayer: 'Pilih pemain...',
    challengeText: 'Teks Cabaran',
    customChallengePlaceholder: 'cth., Nyanyikan lagu Negaraku secara terbalik',
    setTheChallenge: 'Tetapkan Cabaran',
    challengeType: 'Jenis Cabaran',
     // Steal Card
    stealTitle: "Curi Kad Imuniti",
    selectStealTarget: "Anda mahu curi dari siapa?",
    steal: "Curi",
    stealSuccess: "Berjaya! Anda mencuri Kad Imuniti dari {name}!",
    stealFail: "Gagal! Anda telah ditangkap. Sekarang anda mesti menghadapi cabaran yang sukar.",
    noOneToStealFrom: "Tiada sesiapa yang mempunyai Kad Imuniti untuk dicuri.",
    // Battle Card
    battleTitle: "Pertarungan!",
    selectOpponent: "Pilih Lawan",
    challengePlayer: "Cabar",
    rock: "Batu",
    paper: "Kertas",
    scissors: "Gunting",
    chooseYourWeapon: "{name}, pilih senjata anda!",
    reveal: "Dedahkan!",
    battleWinner: "{name} memenangi pertarungan!",
    battleLoser: "{name} kalah dan mesti menghadapi cabaran!",
    battleDraw: "Seri! Cuba lagi!",
    waitingForPlayer: "Menunggu {name}...",
    battleResult: "Keputusan Pertarungan",
    continue: "Teruskan",
  },
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{
  children: ReactNode;
  language: Language;
  setLanguage: (language: Language) => void;
}> = ({ children, language, setLanguage }) => {
  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    let translation = translations[language][key] || key;
    if (options) {
      const processedOptions = {...options};
      // Handle dynamic card name translation
      if ('cardNameKey' in options) {
        const cardKey = options.cardNameKey as Card;
        const cardDetails = CARD_DETAILS[cardKey];
        const cardLocalization = cardDetails[language] || cardDetails[Language.EN];
        if (cardLocalization) {
          processedOptions.cardName = cardLocalization.name;
        }
      }

      Object.keys(processedOptions).forEach(optKey => {
        translation = translation.replace(`{${optKey}}`, String(processedOptions[optKey]));
      });
    }
    return translation;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

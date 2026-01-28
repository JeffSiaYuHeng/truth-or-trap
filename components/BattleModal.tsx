import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import { RPS } from '../types';

const RPS_OPTIONS = [
    { value: RPS.ROCK, emoji: '🪨', labelKey: 'rock' },
    { value: RPS.PAPER, emoji: '📄', labelKey: 'paper' },
    { value: RPS.SCISSORS, emoji: '✂️', labelKey: 'scissors' },
];

const BattleModal: React.FC = () => {
    const appContext = useContext(AppContext);
    const { t } = useLocalization();

    const [challengerChoice, setChallengerChoice] = useState<RPS | null>(null);
    const [opponentChoice, setOpponentChoice] = useState<RPS | null>(null);
    const [turn, setTurn] = useState<'challenger' | 'opponent' | 'reveal'>('challenger');
    const [winner, setWinner] = useState<string | null | 'draw'>(null);
    const [countdown, setCountdown] = useState(3);
    const [isCounting, setIsCounting] = useState(true);

    if (!appContext) return null;
    const { state, dispatch } = appContext;
    const { battle } = state;

    if (!battle) return null;
    const { challenger, opponent } = battle;

    const handleChoice = (choice: RPS) => {
        if (turn === 'challenger') {
            setChallengerChoice(choice);
            setTurn('opponent');
        } else if (turn === 'opponent') {
            setOpponentChoice(choice);
        }
    };

    useEffect(() => {
        if (isCounting && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isCounting && countdown === 0) {
            setIsCounting(false);
        }
    }, [countdown, isCounting]);

    useEffect(() => {
        if (challengerChoice && opponentChoice) {
            const timeout = setTimeout(() => setTurn('reveal'), 500);
            return () => clearTimeout(timeout);
        }
    }, [challengerChoice, opponentChoice]);

    const handleReveal = () => {
        if (!challengerChoice || !opponentChoice) return;

        if (challengerChoice === opponentChoice) {
            setWinner('draw');
        } else if (
            (challengerChoice === RPS.ROCK && opponentChoice === RPS.SCISSORS) ||
            (challengerChoice === RPS.PAPER && opponentChoice === RPS.ROCK) ||
            (challengerChoice === RPS.SCISSORS && opponentChoice === RPS.PAPER)
        ) {
            setWinner(challenger.id);
        } else {
            setWinner(opponent.id);
        }
    };

    const handleReset = () => {
        setChallengerChoice(null);
        setOpponentChoice(null);
        setWinner(null);
        setTurn('challenger');
    };

    const handleEndBattle = () => {
        if (winner && winner !== 'draw') {
            const loserId = winner === challenger.id ? opponent.id : challenger.id;
            dispatch({ type: 'END_BATTLE', payload: { loserId } });
        }
    };

    const renderRevealScreen = () => {
        if (!challengerChoice || !opponentChoice) return null;

        const challengerEmoji = RPS_OPTIONS.find(o => o.value === challengerChoice)?.emoji;
        const opponentEmoji = RPS_OPTIONS.find(o => o.value === opponentChoice)?.emoji;

        let resultMessage = '';
        if (winner === 'draw') {
            resultMessage = t('battleDraw');
        } else if (winner) {
            const winnerPlayer = winner === challenger.id ? challenger : opponent;
            resultMessage = t('battleWinner', { name: winnerPlayer.name });
        }

        return (
            <div className="text-center flex flex-col items-center justify-center h-full w-full">
                <h2 className="text-4xl font-black mb-12 text-[#FAB655] uppercase tracking-tighter">{t('battleResult')}</h2>
                <div className="flex items-center justify-around w-full max-w-lg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="avatar-vibrant w-16 h-16 border-4 border-[#FAB655]">
                            <img src={challenger.avatar} alt={challenger.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{challenger.name}</h3>
                        <div className={`text-7xl transition-all duration-500 transform ${winner && winner !== 'draw' ? (winner === challenger.id ? 'scale-125' : 'opacity-30 grayscale') : ''}`}>{challengerEmoji}</div>
                    </div>
                    <span className="text-3xl font-black text-red-500 mx-4">VS</span>
                    <div className="flex flex-col items-center gap-4">
                        <div className="avatar-vibrant w-16 h-16 border-4 border-[#FAB655]">
                            <img src={opponent.avatar} alt={opponent.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{opponent.name}</h3>
                        <div className={`text-7xl transition-all duration-500 transform ${winner && winner !== 'draw' ? (winner === opponent.id ? 'scale-125' : 'opacity-30 grayscale') : ''}`}>{opponentEmoji}</div>
                    </div>
                </div>
                <p className="text-3xl font-black mt-12 text-gray-800 animate-pop">{resultMessage}</p>
                <div className="mt-12 w-full max-w-xs">
                    {winner === 'draw' ? (
                        <button onClick={handleReset} className="btn-vibrant btn-blue w-full py-4 text-xl">{t('battleDraw')}</button>
                    ) : (
                        <button onClick={handleEndBattle} className="btn-vibrant btn-success w-full py-4 text-xl">{t('continue')}</button>
                    )}
                </div>
            </div>
        );
    }

    if (isCounting) {
        return (
            <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-4">
                <div className="text-8xl md:text-9xl font-black text-[#FAB655] animate-pop">
                    {countdown > 0 ? countdown : "GO!"}
                </div>
                <p className="mt-8 text-2xl font-black text-gray-400 uppercase tracking-widest">{t('battleStarting') || 'GET READY'}</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center p-0 md:p-4">
            <header className="py-8 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-red-500 uppercase tracking-tighter">{t('battleTitle')}</h1>
            </header>

            <main className="w-full h-full flex flex-col md:flex-row">
                {turn !== 'reveal' && !winner && (
                    <div className="flex flex-col md:flex-row w-full h-full">
                        {/* Split Screen Layout */}
                        <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300 ${turn === 'challenger' ? 'bg-blue-50' : 'bg-gray-50 opacity-40'}`}>
                            <div className={`avatar-vibrant w-24 h-24 border-4 ${turn === 'challenger' ? 'border-blue-400 animate-float' : 'border-gray-200 opacity-50'}`}>
                                <img src={challenger.avatar} alt={challenger.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-3xl font-black mt-4 text-gray-800 uppercase line-clamp-1">{challenger.name}</h2>
                            {turn === 'challenger' && (
                                <div className="mt-8 grid grid-cols-1 gap-4 w-full max-w-[160px]">
                                    {RPS_OPTIONS.map(opt => (
                                        <button key={opt.value} onClick={() => handleChoice(opt.value)} className="btn-vibrant bg-white shadow-[0_4px_0_#E5E5E5] text-gray-800 flex items-center gap-4 rounded-2xl p-4">
                                            <span className="text-4xl">{opt.emoji}</span>
                                            <span className="font-black text-xs uppercase">{t(opt.labelKey)}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {challengerChoice && turn !== 'challenger' && <p className="mt-4 text-green-500 font-black text-xl">✓ READY</p>}
                        </div>

                        <div className="w-full h-2 md:h-full md:w-2 bg-red-500 z-10" />

                        <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300 ${turn === 'opponent' ? 'bg-red-50' : 'bg-gray-50 opacity-40'}`}>
                            <div className={`avatar-vibrant w-24 h-24 border-4 ${turn === 'opponent' ? 'border-red-400 animate-float' : 'border-gray-200 opacity-50'}`}>
                                <img src={opponent.avatar} alt={opponent.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-3xl font-black mt-4 text-gray-800 uppercase line-clamp-1">{opponent.name}</h2>
                            {turn === 'opponent' && (
                                <div className="mt-8 grid grid-cols-1 gap-4 w-full max-w-[160px]">
                                    {RPS_OPTIONS.map(opt => (
                                        <button key={opt.value} onClick={() => handleChoice(opt.value)} className="btn-vibrant bg-white shadow-[0_4px_0_#E5E5E5] text-gray-800 flex items-center gap-4 rounded-2xl p-4">
                                            <span className="text-4xl">{opt.emoji}</span>
                                            <span className="font-black text-xs uppercase">{t(opt.labelKey)}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {opponentChoice && turn !== 'opponent' && <p className="mt-4 text-green-500 font-black text-xl">✓ READY</p>}
                        </div>
                    </div>
                )}

                {turn === 'reveal' && !winner && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <button onClick={handleReveal} className="btn-vibrant bg-[#FAB655] py-12 px-24 text-6xl animate-pop shadow-[0_12px_0_#cc9446]">
                            {t('reveal') || 'BOOM!'}
                        </button>
                    </div>
                )}

                {winner && renderRevealScreen()}
            </main>
        </div>
    );
};

export default BattleModal;
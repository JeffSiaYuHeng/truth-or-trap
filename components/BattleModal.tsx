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

    const activePlayer = turn === 'challenger' ? challenger : opponent;
    
    const renderChoiceScreen = () => (
        <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 animate-pulse">{t('chooseYourWeapon', { name: activePlayer.name })}</h2>
            <div className="grid grid-cols-3 gap-4 md:gap-8">
                {RPS_OPTIONS.map(opt => (
                     <button key={opt.value} onClick={() => handleChoice(opt.value)} className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-2xl transform transition-transform hover:scale-110 hover:bg-gray-200 focus:outline-none">
                        <span className="text-6xl md:text-8xl">{opt.emoji}</span>
                        <span className="font-bold mt-2 text-xl">{t(opt.labelKey)}</span>
                    </button>
                ))}
            </div>
             <p className="mt-8 text-xl text-gray-500">
                {turn === 'opponent' && t('waitingForPlayer', { name: opponent.name })}
            </p>
        </div>
    );
    
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
            <div className="text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-4xl font-black mb-8 text-[#FAB655]">{t('battleResult')}</h2>
                <div className="flex items-center justify-around w-full max-w-md text-center">
                    <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-bold">{challenger.name}</h3>
                        <span className={`text-8xl my-4 transition-transform duration-500 ${winner && winner !== 'draw' ? (winner === challenger.id ? 'scale-125' : 'opacity-50') : ''}`}>{challengerEmoji}</span>
                    </div>
                     <span className="text-4xl font-black text-red-500 mx-4">VS</span>
                    <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-bold">{opponent.name}</h3>
                        <span className={`text-8xl my-4 transition-transform duration-500 ${winner && winner !== 'draw' ? (winner === opponent.id ? 'scale-125' : 'opacity-50') : ''}`}>{opponentEmoji}</span>
                    </div>
                </div>
                 <p className="text-3xl font-bold mt-8 animate-bounce">{resultMessage}</p>
                 <div className="mt-8">
                     {winner === 'draw' ? (
                         <button onClick={handleReset} className="text-xl font-bold py-3 px-8 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-transform hover:scale-105">{t('battleDraw')}</button>
                     ) : (
                         <button onClick={handleEndBattle} className="text-xl font-bold py-3 px-8 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-transform hover:scale-105">{t('continue')}</button>
                     )}
                 </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
            <header className="absolute top-8 text-center">
                <h1 className="text-5xl font-black text-red-600">{t('battleTitle')}</h1>
            </header>
            <main className="w-full max-w-xl">
                 {turn !== 'reveal' && !winner && renderChoiceScreen()}
                 {turn === 'reveal' && !winner && 
                    <div className="text-center">
                        <button onClick={handleReveal} style={{backgroundColor: '#FAB655'}} className="text-4xl text-white font-bold py-8 px-12 rounded-full animate-pulse hover:animate-none">{t('reveal')}</button>
                    </div>
                 }
                 {winner && renderRevealScreen()}
            </main>
        </div>
    );
};

export default BattleModal;
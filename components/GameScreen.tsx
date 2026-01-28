import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import { ChallengeType } from '../types';
import { getRandomChallenge } from '../services/challengeService'; // local static data
import CardModal from './CardModal';
import BattleModal from './BattleModal';
import CardAwardPopup from './CardAwardPopup';

// PlayerPickerAnimation stays unchanged
const PlayerPickerAnimation: React.FC = () => {
    const appContext = useContext(AppContext);
    if (!appContext) return null;
    const { state, dispatch } = appContext;
    const { t } = useLocalization();
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    useEffect(() => {
        let picks = 0;
        const totalPicks = 20 + Math.floor(Math.random() * 10);
        const pickerInterval = setInterval(() => {
            setHighlightedIndex(prev => (prev + 1) % state.players.length);
            picks++;
            if (picks >= totalPicks) {
                clearInterval(pickerInterval);
                dispatch({ type: 'NEXT_PLAYER' });
            }
        }, 100);

        return () => clearInterval(pickerInterval);
    }, [state.players.length, dispatch]);

    return (
        <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-700 animate-pulse">{t('playerIsPicking')}</h3>
            <div className="flex flex-wrap justify-center items-center gap-4 min-h-[80px]">
                {state.players.map((player, index) => (
                    <div key={player.id} className={`p-1 rounded-full transition-all duration-100 ${index === highlightedIndex ? 'scale-125' : 'opacity-50'}`}>
                        <div className={`avatar-vibrant w-12 h-12 border-4 ${index === highlightedIndex ? 'border-[#FAB655]' : 'border-transparent'}`}>
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GameScreen: React.FC = () => {
    const appContext = useContext(AppContext);
    if (!appContext) throw new Error('GameScreen must be used within an AppContext.Provider');
    const { state, dispatch } = appContext;
    const { t } = useLocalization();

    const currentPlayer = state.currentPlayerIndex !== null ? state.players[state.currentPlayerIndex] : null;

    const handleSelectChallenge = async (type: ChallengeType) => {
        if (!currentPlayer) return;
        dispatch({ type: 'REQUEST_CHALLENGE', payload: type });
        try {
            const options = {
                isStealFailure: state.isStealFailure,
            };
            const text = getRandomChallenge(type, state.difficulty, state.language, options);
            dispatch({ type: 'RECEIVE_CHALLENGE', payload: { type, text } });
        } catch (error) {
            dispatch({ type: 'CHALLENGE_FAIL' });
        }
    };

    const handleNextPlayer = () => dispatch({ type: 'START_PLAYER_PICKING' });

    if (!currentPlayer && !state.isPickingPlayer && !state.battle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
                <h2 className="text-2xl text-red-500 font-bold mb-4">{t('error')}</h2>
                <p className="mb-6">No current player found.</p>
                <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="btn-vibrant">
                    {t('resetGame')}
                </button>
            </div>
        );
    }

    const renderContent = () => {
        if (state.isPickingPlayer) return <PlayerPickerAnimation />;
        if (state.isLoading) {
            return (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                    <div style={{ borderColor: '#FAB655' }} className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 mx-auto"></div>
                    <p className="text-2xl font-black text-[#FAB655] animate-pulse uppercase tracking-widest">{t('loadingChallenge')}</p>
                </div>
            );
        }

        if (state.currentChallenge && state.currentChallenge.text) {
            const challengeTypeText = state.currentChallenge.type === ChallengeType.TRUTH ? t('truth') : t('dare');
            return (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 w-full animate-pop">
                    <div className={`w-full max-w-sm card-vibrant bg-white p-8 relative overflow-hidden shadow-2xl animate-card-fly`}>
                        {/* Background pattern based on type for accessibility */}
                        <div className={`absolute inset-0 opacity-5 ${state.currentChallenge.type === ChallengeType.TRUTH ? 'pattern-dots' : 'pattern-stripes'}`} />

                        <div className="relative z-10">
                            <div className={`inline-block px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest mb-4 ${state.currentChallenge.type === ChallengeType.TRUTH ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                {state.difficulty} {challengeTypeText}
                            </div>
                            <p className="text-3xl md:text-4xl font-black leading-tight text-gray-800">
                                {state.currentChallenge.text}
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-sm space-y-4 pt-4">
                        <button
                            onClick={handleNextPlayer}
                            className="btn-vibrant btn-success w-full py-5 text-2xl shadow-[0_8px_0_#46a302]"
                        >
                            {t('done') || 'DONE'}
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full flex-grow flex flex-col items-center justify-start gap-12 py-8 pt-4">
                <div className="text-center space-y-4 spotlight flex flex-col justify-center items-center">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[#FAB655] opacity-20 animate-pulse-ring" />
                        <div className="avatar-vibrant w-32 h-32 border-8 border-[#FAB655] relative z-10">
                            <img src={currentPlayer?.avatar} alt={currentPlayer?.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="space-y-1 text-center">
                        <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter">
                            {currentPlayer?.name}
                        </h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            Your Turn
                        </p>
                    </div>
                </div>

                <div className="w-full flex gap-4 h-64 md:h-80">
                    <button
                        onClick={() => handleSelectChallenge(ChallengeType.TRUTH)}
                        disabled={state.isForcedDare || state.isStealFailure}
                        className="btn-vibrant btn-blue flex-1 flex flex-col items-center justify-center gap-2 text-3xl font-black relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10 pattern-dots pointer-events-none" />
                        <span className="relative z-10">{t('truth')}</span>
                    </button>
                    <button
                        onClick={() => handleSelectChallenge(ChallengeType.DARE)}
                        className="btn-vibrant btn-error flex-1 flex flex-col items-center justify-center gap-2 text-3xl font-black relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10 pattern-stripes pointer-events-none" />
                        <span className="relative z-10">{t('dare')}</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen flex flex-col bg-white overflow-hidden">
                <header className="p-4 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm">
                    <button
                        onClick={() => dispatch({ type: 'RESET_GAME' })}
                        className="text-gray-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1 hover:text-red-500"
                    >
                        &times; {t('quit') || 'Quit'}
                    </button>
                </header>

                <main className="flex-grow flex flex-col items-center px-4 overflow-y-auto">
                    {renderContent()}
                </main>

                {/* VISIBLE HANDLE FOR CARDS */}
                {currentPlayer && (
                    <div
                        onClick={() => dispatch({ type: 'OPEN_CARD_MODAL' })}
                        className={`bottom-sheet-handle animate-bounce-slow flex flex-col items-center justify-center ${state.isPickingPlayer || state.isLoading || state.currentChallenge ? 'translate-y-full' : ''}`}
                    >
                        <span className="text-xs font-black tracking-widest">
                            ITEMS ({currentPlayer.cards.length})
                        </span>
                    </div>
                )}
            </div>
            {state.isCardModalOpen && <CardModal />}
            {state.battle && <BattleModal />}
            <CardAwardPopup />
        </>
    );
};

export default GameScreen;

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
                    <div key={player.id} className={`p-1 rounded-full transition-all duration-100 ${index === highlightedIndex ? 'bg-[#FAB655] scale-125 shadow-lg shadow-yellow-400/50' : 'bg-gray-200'}`}>
                        <span className="text-4xl px-1">{player.avatar}</span>
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
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-2xl text-red-500">{t('error')}</h2>
                <p>No current player found.</p>
                <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="mt-4 bg-[#FAB655] text-white px-4 py-2 rounded-lg">
                    {t('resetGame')}
                </button>
            </div>
        );
    }

    const renderContent = () => {
        if (state.isPickingPlayer) return <PlayerPickerAnimation />;
        if (state.isLoading) {
            return (
                <div className="text-center space-y-4">
                    <div style={{ borderColor: '#FAB655' }} className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto"></div>
                    <p className="text-xl font-semibold text-gray-700">{t('loadingChallenge')}</p>
                </div>
            );
        }

        if (state.currentChallenge && state.currentChallenge.text) {
            const challengeTypeText = state.currentChallenge.type === ChallengeType.TRUTH ? t('truth') : t('dare');
            return (
                <div className="text-center space-y-6 flex flex-col items-center">
                    {state.gameMessage && (
                        <p className="text-orange-500 font-semibold mb-2 animate-fade-in">
                            {t(state.gameMessage.key, state.gameMessage.options)}
                        </p>
                    )}
                    <h3 className="text-2xl font-bold text-[#FAB655]">{challengeTypeText}</h3>
                    <p className="text-2xl md:text-3xl font-semibold leading-relaxed min-h-[100px]">
                        {state.currentChallenge.text}
                    </p>
                    <button
                        onClick={handleNextPlayer}
                        className="w-full max-w-xs text-xl text-white font-bold py-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:opacity-90 hover:scale-105"
                        style={{ backgroundColor: '#FAB655' }}
                    >
                        {t('nextPlayer')}
                    </button>
                </div>
            );
        }

        return (
            <div className="text-center space-y-6">
                {state.isForcedDare ? (
                    <p className="text-2xl font-bold text-red-500 animate-pulse">{t('forcedDare')}</p>
                ) : (
                    <p className="text-3xl font-bold">{t('whosNext')}</p>
                )}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleSelectChallenge(ChallengeType.TRUTH)}
                        disabled={state.isForcedDare || state.isStealFailure}
                        className="text-xl text-white font-bold py-10 px-6 rounded-lg transition-all duration-300 ease-in-out bg-sky-500 w-full hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('truth')}
                    </button>
                    <button
                        onClick={() => handleSelectChallenge(ChallengeType.DARE)}
                        className="text-xl text-white font-bold py-10 px-6 rounded-lg transition-all duration-300 ease-in-out bg-rose-500 w-full hover:shadow-lg hover:shadow-rose-500/50 hover:scale-105"
                    >
                        {t('dare')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="absolute top-4 left-4 text-gray-500 hover:text-red-500 transition-colors z-10 font-semibold">
                    {t('resetGame')}
                </button>
                <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    <header className="text-center min-h-[68px]">
                        {currentPlayer && !state.isPickingPlayer && (
                            <h2 className="text-2xl font-bold text-gray-600">
                                {t('turn')}{' '}
                                <span className="text-4xl font-black text-[#FAB655]">
                                    {currentPlayer.name} {currentPlayer.avatar}
                                </span>
                            </h2>
                        )}
                        {state.gameMessage && !state.currentChallenge.text && !state.isPickingPlayer && (
                            <p className="text-green-600 font-bold animate-pulse mt-2">
                                {t(state.gameMessage.key, state.gameMessage.options)}
                            </p>
                        )}
                    </header>

                    <main className="bg-gray-50 rounded-xl p-8 min-h-[250px] flex items-center justify-center">
                        {renderContent()}
                    </main>

                    {currentPlayer && (
                        <footer className="flex flex-col md:flex-row gap-3 justify-center">
                            <button
                                onClick={() => dispatch({ type: 'OPEN_CARD_MODAL' })}
                                disabled={!currentPlayer || currentPlayer.cards.length === 0 || state.isPickingPlayer}
                                className="flex-1 text-md font-bold py-3 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                {t('useCard')} ({currentPlayer.cards.length})
                            </button>
                        </footer>
                    )}
                </div>
            </div>
            {state.isCardModalOpen && <CardModal />}
            {state.battle && <BattleModal />}
            <CardAwardPopup />
        </>
    );
};

export default GameScreen;

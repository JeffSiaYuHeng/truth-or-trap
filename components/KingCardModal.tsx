import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import { ChallengeType } from '../types';

interface KingCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const KingCardModal: React.FC<KingCardModalProps> = ({ isOpen, onClose }) => {
    const appContext = useContext(AppContext);
    const { t } = useLocalization();

    const [targetPlayerId, setTargetPlayerId] = useState('');
    const [challengeText, setChallengeText] = useState('');
    const [challengeType, setChallengeType] = useState<ChallengeType>(ChallengeType.DARE);

    if (!appContext) return null;
    const { state, dispatch } = appContext;

    const currentPlayer = state.currentPlayerIndex !== null ? state.players[state.currentPlayerIndex] : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetPlayerId || !challengeText.trim()) {
            alert('Please select a player and write a challenge.');
            return;
        }
        dispatch({
            type: 'SET_CUSTOM_CHALLENGE',
            payload: {
                targetPlayerId,
                challengeText: challengeText.trim(),
                challengeType,
            },
        });
        onClose();
    };

    if (!isOpen || !currentPlayer) return null;

    // Filter out the current player from the target list
    const targetablePlayers = state.players.filter(p => p.id !== currentPlayer.id);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-[#FAB655]" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-[#FAB655]">{t('kingCardTitle')}</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                    </div>

                    <div>
                        <label htmlFor="target-player" className="block text-lg font-bold text-gray-700 mb-2">{t('targetPlayer')}</label>
                        <select
                            id="target-player"
                            value={targetPlayerId}
                            onChange={(e) => setTargetPlayerId(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-gray-200 focus:border-[#FAB655] focus:ring-0 text-gray-900 rounded-lg px-4 py-3 transition"
                            required
                        >
                            <option value="" disabled>{t('selectPlayer')}</option>
                            {targetablePlayers.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.avatar} {player.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                         <label className="block text-lg font-bold text-gray-700 mb-2">{t('challengeType')}</label>
                         <div className="flex gap-4">
                             <button type="button" onClick={() => setChallengeType(ChallengeType.TRUTH)} className={`flex-1 font-bold py-3 rounded-lg transition-all ${challengeType === ChallengeType.TRUTH ? 'bg-sky-500 text-white ring-2 ring-offset-2 ring-sky-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                 {t('truth')}
                             </button>
                             <button type="button" onClick={() => setChallengeType(ChallengeType.DARE)} className={`flex-1 font-bold py-3 rounded-lg transition-all ${challengeType === ChallengeType.DARE ? 'bg-rose-500 text-white ring-2 ring-offset-2 ring-rose-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                 {t('dare')}
                             </button>
                         </div>
                    </div>
                    
                    <div>
                        <label htmlFor="challenge-text" className="block text-lg font-bold text-gray-700 mb-2">{t('challengeText')}</label>
                        <textarea
                            id="challenge-text"
                            value={challengeText}
                            onChange={(e) => setChallengeText(e.target.value)}
                            placeholder={t('customChallengePlaceholder')}
                            className="w-full bg-gray-100 border-2 border-gray-200 focus:border-[#FAB655] focus:ring-0 text-gray-900 rounded-lg px-4 py-3 transition resize-none"
                            rows={3}
                            required
                        />
                    </div>

                    <button type="submit" style={{backgroundColor: '#FAB655'}} className="w-full text-xl text-white font-bold py-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:opacity-90 hover:scale-105">
                        {t('setTheChallenge')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KingCardModal;
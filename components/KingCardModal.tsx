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
            <div className="w-full max-w-lg bg-white card-vibrant p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-[#FAB655] uppercase tracking-tighter">{t('kingCardTitle')}</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                    </div>

                    <div>
                        <label htmlFor="target-player" className="block text-lg font-bold text-gray-700 mb-2">{t('targetPlayer')}</label>
                        <select
                            id="target-player"
                            value={targetPlayerId}
                            onChange={(e) => setTargetPlayerId(e.target.value)}
                            className="w-full bg-white border-2 border-gray-200 focus:border-[#FAB655] outline-none rounded-xl px-4 py-3 transition text-gray-800 font-bold"
                            required
                        >
                            <option value="" disabled>{t('selectPlayer')}</option>
                            {targetablePlayers.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">{t('challengeType')}</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setChallengeType(ChallengeType.TRUTH)}
                                className={`btn-vibrant flex-1 py-3 ${challengeType === ChallengeType.TRUTH ? 'btn-blue scale-105' : 'bg-gray-100 shadow-[0_4px_0_#E5E5E5] text-gray-500'}`}>
                                {t('truth')}
                            </button>
                            <button type="button" onClick={() => setChallengeType(ChallengeType.DARE)}
                                className={`btn-vibrant flex-1 py-3 ${challengeType === ChallengeType.DARE ? 'btn-error scale-105' : 'bg-gray-100 shadow-[0_4px_0_#E5E5E5] text-gray-500'}`}>
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
                            className="w-full bg-white border-2 border-gray-200 focus:border-[#FAB655] outline-none rounded-xl px-4 py-3 transition resize-none text-gray-800 font-medium"
                            rows={3}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-vibrant w-full py-4 text-xl">
                        {t('setTheChallenge')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KingCardModal;
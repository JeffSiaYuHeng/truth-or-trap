import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import { Card } from '../types';

interface StealSetupModalProps {
    onClose: () => void;
}

const StealSetupModal: React.FC<StealSetupModalProps> = ({ onClose }) => {
    const appContext = useContext(AppContext);
    const { t } = useLocalization();
    const [targetPlayerId, setTargetPlayerId] = useState('');

    if (!appContext) return null;
    const { state, dispatch } = appContext;

    const currentPlayer = state.currentPlayerIndex !== null ? state.players[state.currentPlayerIndex] : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetPlayerId) {
            alert('Please select a target.');
            return;
        }
        dispatch({ type: 'ATTEMPT_STEAL', payload: { targetId: targetPlayerId } });
    };

    if (!currentPlayer) return null;

    const targetablePlayers = state.players.filter(p => p.id !== currentPlayer.id && p.cards.includes(Card.IMMUNITY));

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-white card-vibrant p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-teal-500 uppercase tracking-tighter">{t('stealTitle')}</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
                    </div>

                    {targetablePlayers.length > 0 ? (
                        <>
                            <div>
                                <label htmlFor="target-player" className="block text-lg font-bold text-gray-700 mb-2">{t('selectStealTarget')}</label>
                                <select
                                    id="target-player"
                                    value={targetPlayerId}
                                    onChange={(e) => setTargetPlayerId(e.target.value)}
                                    className="w-full bg-white border-2 border-gray-200 focus:border-teal-500 outline-none rounded-xl px-4 py-3 transition text-gray-800 font-bold"
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

                            <button type="submit" className="btn-vibrant bg-teal-500 shadow-[0_4px_0_#1a7f71] w-full text-xl py-4">
                                {t('steal')}
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-gray-400 font-bold py-12">{t('noOneToStealFrom')}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default StealSetupModal;
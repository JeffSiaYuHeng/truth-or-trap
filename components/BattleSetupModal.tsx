import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';

interface BattleSetupModalProps {
    onClose: () => void;
}

const BattleSetupModal: React.FC<BattleSetupModalProps> = ({ onClose }) => {
    const appContext = useContext(AppContext);
    const { t } = useLocalization();
    const [targetPlayerId, setTargetPlayerId] = useState('');

    if (!appContext) return null;
    const { state, dispatch } = appContext;

    const currentPlayer = state.currentPlayerIndex !== null ? state.players[state.currentPlayerIndex] : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetPlayerId) {
            alert('Please select an opponent.');
            return;
        }
        dispatch({ type: 'START_BATTLE', payload: { opponentId: targetPlayerId } });
        // No need to call onClose, as the main card modal is already closed by the reducer
    };

    if (!currentPlayer) return null;

    const targetablePlayers = state.players.filter(p => p.id !== currentPlayer.id);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-red-300" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-red-500">{t('battleTitle')}</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                    </div>

                    <div>
                        <label htmlFor="target-player" className="block text-lg font-bold text-gray-700 mb-2">{t('selectOpponent')}</label>
                        <select
                            id="target-player"
                            value={targetPlayerId}
                            onChange={(e) => setTargetPlayerId(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-gray-200 focus:border-red-500 focus:ring-0 text-gray-900 rounded-lg px-4 py-3 transition"
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

                    <button type="submit" className="w-full text-xl text-white font-bold py-4 rounded-lg transition-all duration-300 ease-in-out bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105">
                        {t('challengePlayer')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BattleSetupModal;
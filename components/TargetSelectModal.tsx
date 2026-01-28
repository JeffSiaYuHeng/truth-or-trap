import React from 'react';
import { Player, Card } from '../types';
import { CARD_DETAILS } from '../constants';

interface TargetSelectModalProps {
    isOpen: boolean;
    cardType: Card.MIRROR | Card.PARTNER;
    players: Player[];
    currentPlayerId: string;
    language: 'en' | 'cn' | 'my';
    onSelectTarget: (targetId: string) => void;
    onClose: () => void;
}

const TargetSelectModal: React.FC<TargetSelectModalProps> = ({
    isOpen,
    cardType,
    players,
    currentPlayerId,
    language,
    onSelectTarget,
    onClose,
}) => {
    if (!isOpen) return null;

    const cardDetails = CARD_DETAILS[cardType][language];
    const isMirror = cardType === Card.MIRROR;

    // Filter out the current player from targets
    const availableTargets = players.filter(p => p.id !== currentPlayerId);

    const titleText = {
        en: isMirror ? '↩️ Select Target to Redirect' : '🔗 Select Partner',
        cn: isMirror ? '↩️ 选择转移目标' : '🔗 选择伙伴',
        my: isMirror ? '↩️ Pilih Sasaran' : '🔗 Pilih Rakan',
    };

    const subtitleText = {
        en: isMirror
            ? 'The challenge will be redirected to this player!'
            : 'This player will do the challenge WITH you!',
        cn: isMirror
            ? '挑战将转移给这名玩家！'
            : '这名玩家将与你一起完成挑战！',
        my: isMirror
            ? 'Cabaran akan dialihkan kepada pemain ini!'
            : 'Pemain ini akan melakukan cabaran BERSAMA anda!',
    };

    const cancelText = {
        en: 'Cancel',
        cn: '取消',
        my: 'Batal',
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content target-select-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="target-modal-header">
                    <div className="card-icon-display">
                        <img
                            src={CARD_DETAILS[cardType].image}
                            alt={cardDetails.name}
                            className="card-icon-img"
                        />
                    </div>
                    <h2 className="target-modal-title">{titleText[language]}</h2>
                    <p className="target-modal-subtitle">{subtitleText[language]}</p>
                </div>

                {/* Player List */}
                <div className="target-player-list">
                    {availableTargets.map((player) => (
                        <button
                            key={player.id}
                            className="target-player-item btn-vibrant"
                            onClick={() => onSelectTarget(player.id)}
                        >
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="target-player-avatar"
                            />
                            <span className="target-player-name">{player.name}</span>
                            <span className="target-select-arrow">→</span>
                        </button>
                    ))}
                </div>

                {/* Cancel Button */}
                <button
                    className="btn-vibrant btn-secondary target-cancel-btn"
                    onClick={onClose}
                >
                    {cancelText[language]}
                </button>
            </div>
        </div>
    );
};

export default TargetSelectModal;

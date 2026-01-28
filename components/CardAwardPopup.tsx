import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import { CARD_DETAILS } from '../constants';
import { Language } from '../types';

const CardAwardPopup: React.FC = () => {
    const appContext = useContext(AppContext);
    if (!appContext) return null;

    const { state, dispatch } = appContext;
    const { t, language } = useLocalization();

    if (!state.lastCardAwarded) {
        return null;
    }

    const { playerName, card } = state.lastCardAwarded;
    const cardDetails = CARD_DETAILS[card];
    const cardLocalization = cardDetails[language] || cardDetails[Language.EN];


    const handleClose = () => {
        dispatch({ type: 'CLEAR_CARD_AWARD' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <div
                className="w-full max-w-sm bg-white card-vibrant p-8 space-y-6 text-center animate-drop-and-bounce"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-4">
                    <div className="text-7xl animate-bounce">🎉</div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
                        {t('cardObtained')}
                    </h2>
                    <p className="text-lg text-gray-500 font-bold">
                        {t('chanceCardAwarded', { playerName, cardName: cardLocalization.name })}
                    </p>
                    <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 border-2 border-gray-100 shadow-inner">
                        <img src={cardDetails.image} alt={cardLocalization.name} className="w-32 h-44 mb-2 rounded-xl shadow-lg transform -rotate-3 transition-transform hover:rotate-0" />
                        <h3 className="font-bold text-gray-800 text-2xl">{cardLocalization.name}</h3>
                        <p className="text-gray-500 text-xs leading-snug">{cardLocalization.description}</p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="btn-vibrant btn-success w-full py-4 text-xl"
                >
                    {t('continue')}
                </button>
            </div>
        </div>
    );
};

export default CardAwardPopup;

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div 
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6 border-2 border-[#FAB655] text-center animate-drop-and-bounce"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-4">
                     <div className="text-6xl animate-wiggle">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('cardObtained')}
                    </h2>
                    <p className="text-lg text-gray-700">
                        {t('chanceCardAwarded', { playerName, cardName: cardLocalization.name })}
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 border border-yellow-200">
                        <img src={cardDetails.image} alt={cardLocalization.name} className="w-20 h-20 mb-2" />
                        <h3 className="font-bold text-yellow-800 text-xl">{cardLocalization.name}</h3>
                        <p className="text-yellow-700 text-sm">{cardLocalization.description}</p>
                    </div>
                </div>
                 <button 
                    onClick={handleClose} 
                    style={{backgroundColor: '#FAB655'}}
                    className="w-full mt-4 text-xl text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:opacity-90 hover:scale-105"
                >
                    {t('continue')}
                </button>
            </div>
        </div>
    );
};

export default CardAwardPopup;

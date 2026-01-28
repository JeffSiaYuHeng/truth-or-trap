import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { CARD_DETAILS } from '../constants';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const { t, language } = useLocalization();
  const [step, setStep] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (key: string) => {
    setFlippedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = [
    {
      title: t('tutWelcomeTitle'),
      content: t('tutWelcomeText'),
    },
    {
      title: t('tutRouletteTitle'),
      content: t('tutRouletteText'),
    },
    {
      title: t('tutChoiceTitle'),
      content: t('tutChoiceText'),
    },
    {
      title: t('tutCardsTitle'),
      content: t('tutCardsText'),
      showCards: true
    },
    {
      title: t('tutReadyTitle'),
      content: t('tutReadyText'),
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="relative card-vibrant p-10 max-w-lg w-full bg-white space-y-8 animate-drop-and-bounce" onClick={e => e.stopPropagation()}>
        {/* Progress Bar */}
        <div className="flex gap-2 justify-center mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#FAB655]' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
            {currentStep.title}
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-sm mx-auto">
            {currentStep.content}
          </p>

          {currentStep.showCards && (
            <div className="grid grid-cols-3 gap-3 pt-6 px-1">
              {Object.entries(CARD_DETAILS).map(([key, details]) => {
                const isFlipped = flippedCards[key];
                const cardLoc = details[language] || details['en'];

                return (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <div
                      className="w-full aspect-[2/3] perspective-1000 cursor-pointer"
                      onClick={() => toggleFlip(key)}
                    >
                      <div className={`relative w-full h-full transition-transform-600 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-sm border-[1px] border-gray-100">
                          <img src={details.image} alt={key} className="w-full h-full object-cover" />
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-800 rounded-xl flex flex-col items-center justify-center p-2 text-white shadow-xl border-2 border-[#FAB655]">
                          <span className="text-[8px] font-black uppercase text-[#FAB655] mb-1">{cardLoc.name}</span>
                          <p className="text-[7px] font-bold leading-tight">{cardLoc.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="btn-vibrant bg-gray-50 shadow-[0_4px_0_#E5E5E5] text-gray-400 py-3 px-6 text-lg"
            >
              Back
            </button>
          )}
          <button
            onClick={nextStep}
            className="btn-vibrant btn-blue flex-grow py-3 text-xl"
          >
            {step === steps.length - 1 ? t('gotIt') : "Next"}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-300 hover:text-gray-800 text-3xl font-light"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Tutorial;

import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const { t } = useLocalization();

  const rawText = t('instructionsContent');
  const paragraphs = rawText.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative p-6 max-w-3xl w-full bg-white rounded-xl shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          📘 {t('tutorial') || 'Game Tutorial'}
        </h2>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

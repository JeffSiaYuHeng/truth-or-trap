import React, { useContext, useState } from "react";
import { AppContext } from "../App";
import { useLocalization } from "../context/LocalizationContext";
import { CARD_DETAILS } from "../constants";
import { Card, Language } from "../types";
import KingCardModal from "./KingCardModal";
import BattleSetupModal from "./BattleSetupModal";
import StealSetupModal from "./StealSetupModal";

const CardModal: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;
  const { state, dispatch } = appContext;
  const { t, language } = useLocalization();
  const [isKingModalOpen, setKingModalOpen] = useState(false);
  const [isBattleSetupOpen, setBattleSetupOpen] = useState(false);
  const [isStealSetupOpen, setStealSetupOpen] = useState(false);

  const currentPlayer =
    state.currentPlayerIndex !== null
      ? state.players[state.currentPlayerIndex]
      : null;

  if (!currentPlayer) return null;

  const handleUseCard = (card: Card) => {
    if (card === Card.KING) {
      setKingModalOpen(true);
    } else if (card === Card.BATTLE) {
      setBattleSetupOpen(true);
    } else if (card === Card.STEAL) {
      setStealSetupOpen(true);
    } else {
      dispatch({ type: "USE_CARD", payload: { card } });
    }
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_CARD_MODAL" });
  };

  const handleSubModalClose = () => {
    setKingModalOpen(false);
    setBattleSetupOpen(false);
    setStealSetupOpen(false);
    handleClose();
  };

  if (isKingModalOpen)
    return <KingCardModal isOpen={true} onClose={handleSubModalClose} />;
  if (isBattleSetupOpen)
    return <BattleSetupModal onClose={handleSubModalClose} />;
  if (isStealSetupOpen)
    return <StealSetupModal onClose={handleSubModalClose} />;

  const hasChallenge = !!state.currentChallenge.text;

  const isCardDisabled = (card: Card): boolean => {
    switch (card) {
      // Immunity can be used anytime to skip the current action (choosing T/D or doing the challenge)
      case Card.IMMUNITY:
        return false;

      // These cards are used to INITIATE an action for a turn.
      // They cannot be used if a challenge is already active.
      case Card.KING:
      case Card.STEAL:
      case Card.BATTLE:
        return hasChallenge;

      default:
        return false;
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${state.isCardModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={handleClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 space-y-6 transition-transform duration-300 shadow-[0_-8px_24px_rgba(0,0,0,0.1)] border-t-2 border-gray-100 ${state.isCardModalOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
            🎒 {t("yourItems") || "YOUR ITEMS"} ({currentPlayer.cards.length})
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>

        {currentPlayer.cards.length > 0 ? (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pb-8">
            {currentPlayer.cards.map((card, index) => {
              const cardDetails = CARD_DETAILS[card];
              const cardLocalization =
                cardDetails[language] || cardDetails[Language.EN];
              return (
                <div
                  key={`${card}-${index}`}
                  className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-[#1CB0F6] active:scale-[0.98]"
                >
                  <img
                    src={cardDetails.image}
                    alt={cardLocalization.name}
                    className="w-20 h-28 flex-shrink-0 rounded-xl shadow-md rotate-2"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-xl">
                      {cardLocalization.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-snug">
                      {cardLocalization.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseCard(card)}
                    disabled={isCardDisabled(card)}
                    className="btn-vibrant btn-success py-2 px-6"
                  >
                    {t("use")}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 grayscale opacity-30">🃏</div>
            <p className="text-gray-400 font-bold text-xl">{t("noCards")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardModal;

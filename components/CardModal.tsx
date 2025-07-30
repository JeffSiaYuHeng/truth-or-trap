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
      case Card.REVERSE:
        // Can only be used if there is a challenge AND a previous player to reverse to.
        return !hasChallenge || state.previousPlayerIndex === null;

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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#FAB655]">{t("myCards")}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-800 text-3xl font-light"
          >
            &times;
          </button>
        </div>

        {currentPlayer.cards.length > 0 ? (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {currentPlayer.cards.map((card, index) => {
              const cardDetails = CARD_DETAILS[card];
              const cardLocalization =
                cardDetails[language] || cardDetails[Language.EN];
              return (
                <div
                  key={`${card}-${index}`}
                  className="bg-gray-100 p-3 rounded-lg flex items-center justify-between gap-4"
                >
                  <img
                    src={cardDetails.image}
                    alt={cardLocalization.name}
                    className="w-12 h-16 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {cardLocalization.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {cardLocalization.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseCard(card)}
                    disabled={isCardDisabled(card)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
                  >
                    {t("use")}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">{t("noCards")}</p>
        )}
      </div>
    </div>
  );
};

export default CardModal;

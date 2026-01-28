import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { useLocalization } from "../context/LocalizationContext";
import { Player, Language, Difficulty } from "../types";
import { AVATARS } from "../constants";
import Tutorial from "../components/tutorial"; // Adjust path if needed

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const languages = [
    // { code: Language.EN, label: "EN" }, 
    { code: Language.CN, label: "CN" },
    // { code: Language.MY, label: "MY" },  
  ];
  return (
    <div className="flex bg-white/50 p-1.5 rounded-2xl border-2 border-gray-100 backdrop-blur-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-4 py-2 flex items-center justify-center rounded-xl text-xl transition-all duration-300 ${language === lang.code
            ? "bg-[#FAB655] text-white shadow-md scale-105"
            : "text-gray-400 hover:bg-gray-50"
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

const SetupScreen: React.FC = () => {
  const appContext = useContext(AppContext);
  const [showTutorial, setShowTutorial] = useState(false);
  if (!appContext) {
    throw new Error("SetupScreen must be used within an AppContext.Provider");
  }
  const { state, dispatch } = appContext;
  const { t } = useLocalization();
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        cards: [],
        dareStreak: 0,
        consecutiveTurns: 0,
      };
      dispatch({ type: "ADD_PLAYER", payload: newPlayer });
      setNewPlayerName("");
    }
  };

  const handleStartGame = () => {
    if (state.players.length >= 2) {
      dispatch({ type: "START_GAME" });
    }
  };

  const canContinue =
    state.players.length >= 2 && state.currentPlayerIndex !== null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-32">
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowTutorial(true)}
            className="group flex items-center gap-2 bg-white/50 backdrop-blur-sm border-2 border-gray-100 rounded-full py-2 px-4 shadow-sm hover:border-[#1CB0F6] transition-all duration-300"
          >
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-[#1CB0F6]">
              {t("tutorial") || "How to Play"}
            </span>
          </button>
          <LanguageSelector />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex-grow flex flex-col justify-center space-y-8 px-4 py-8">
        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
        <section className="card-vibrant bg-white">
          <h2 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-tight">
            {t("players")}
          </h2>

          <div className="flex mb-4 gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
              placeholder={t("playerName")}
              className="player-input flex-grow bg-gray-50 border-2 border-gray-200 focus:border-[#FAB655] outline-none rounded-2xl px-4 py-3 min-w-0 font-bold"
            />
            <button
              onClick={handleAddPlayer}
              className="btn-vibrant py-3 px-6 rounded-2xl text-xl"
            >
              +
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {[...state.players].reverse().map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border-2 border-transparent hover:border-gray-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="avatar-vibrant w-12 h-12 border-2 shadow-sm">
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-gray-700 text-lg">{player.name}</span>
                </div>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_PLAYER", payload: player.id })
                  }
                  className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full font-black text-xl hover:bg-red-200 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4 px-2 uppercase tracking-tight">
            {t("difficulty")}
          </h2>
          <div className="flex flex-col gap-4 px-2">
            {[Difficulty.SIMPLE, Difficulty.NORMAL, Difficulty.EXTREME].map((level) => {
              const isSelected = state.difficulty === level;
              const difficultyClass =
                level === Difficulty.SIMPLE ? "simple-selected" :
                  level === Difficulty.NORMAL ? "normal-selected" :
                    "extreme-selected";

              return (
                <button
                  key={level}
                  onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: level })}
                  className={`w-full p-5 rounded-[24px] text-left transition-all duration-300 border-4 difficulty-btn ${isSelected
                    ? `${difficultyClass} scale-100 shadow-inner`
                    : "bg-white border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-2xl text-gray-800 mb-1">
                        {t(level.toLowerCase())}
                      </h3>
                      <p className="text-sm text-gray-500 font-bold leading-tight">
                        {t(`${level.toLowerCase()}Desc`)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="sticky-footer flex flex-col items-center gap-3">
        <button
          onClick={handleStartGame}
          disabled={state.players.length < 2}
          className="btn-vibrant btn-success w-full max-w-md py-5 text-2xl animate-pop shadow-[0_8px_0_#46a302]"
        >
          {canContinue ? t("continueGame") : "START PARTY"}
        </button>

        {state.players.length > 0 && (
          <button
            onClick={() => dispatch({ type: "RESET_GAME" })}
            className="text-gray-400 font-bold text-sm uppercase tracking-wider hover:text-gray-600"
          >
            {t("newGame")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;

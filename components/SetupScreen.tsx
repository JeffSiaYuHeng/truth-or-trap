import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { useLocalization } from "../context/LocalizationContext";
import { Player, GameMode, Language, Difficulty } from "../types";
import { AVATARS } from "../constants";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();
  const languages = [
    { code: Language.EN, label: "EN" },
    { code: Language.CN, label: "中文" },
    { code: Language.MY, label: "MY" },
  ];
  return (
    <div className="flex justify-center space-x-2 my-4">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
            language === lang.code
              ? "bg-[#FAB655] text-white shadow-lg scale-110"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <header className="text-center">
          <img
            src="/images/logo/logo.png"
            alt={t("title")}
            className="w-64 mx-auto mb-2"
          />
          <LanguageSelector />
        </header>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("players")}
          </h2>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {state.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_PLAYER", payload: player.id })
                  }
                  className="text-red-500 hover:text-red-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex mt-3 gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
              placeholder={t("playerName")}
              className="flex-grow bg-gray-100 border-2 border-gray-200 focus:border-[#FAB655] focus:ring-0 text-gray-900 rounded-lg px-4 py-2 transition"
            />
            <button
              onClick={handleAddPlayer}
              style={{ backgroundColor: "#FAB655" }}
              className="hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
            >
              {t("addPlayer")}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("gameMode")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                dispatch({ type: "SET_GAME_MODE", payload: GameMode.PRIVATE })
              }
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                state.gameMode === GameMode.PRIVATE
                  ? "bg-white ring-2 ring-[#FAB655]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">
                {t("privateMode")}
              </h3>
              <p className="text-sm text-gray-500">{t("privateModeDesc")}</p>
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_GAME_MODE", payload: GameMode.PUBLIC })
              }
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                state.gameMode === GameMode.PUBLIC
                  ? "bg-white ring-2 ring-[#FAB655]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">
                {t("publicMode")}
              </h3>
              <p className="text-sm text-gray-500">{t("publicModeDesc")}</p>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("difficulty")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() =>
                dispatch({ type: "SET_DIFFICULTY", payload: Difficulty.SIMPLE })
              }
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                state.difficulty === Difficulty.SIMPLE
                  ? "bg-white ring-2 ring-[#FAB655]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">{t("simple")}</h3>
              <p className="text-sm text-gray-500">{t("simpleDesc")}</p>
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_DIFFICULTY", payload: Difficulty.NORMAL })
              }
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                state.difficulty === Difficulty.NORMAL
                  ? "bg-white ring-2 ring-[#FAB655]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">{t("normal")}</h3>
              <p className="text-sm text-gray-500">{t("normalDesc")}</p>
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: "SET_DIFFICULTY",
                  payload: Difficulty.EXTREME,
                })
              }
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                state.difficulty === Difficulty.EXTREME
                  ? "bg-white ring-2 ring-[#FAB655]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">
                {t("extreme")}
              </h3>
              <p className="text-sm text-gray-500">{t("extremeDesc")}</p>
            </button>
          </div>
        </section>

        <div className="pt-4 flex flex-col space-y-3">
          <button
            onClick={handleStartGame}
            disabled={state.players.length < 2}
            className="w-full text-xl bg-orange-300 text-white font-bold py-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:shadow-lg hover:opacity-90 hover:scale-105"
          >
            {canContinue ? t("continueGame") : t("startGame")}
          </button>

          {state.players.length > 0 && (
            <button
              onClick={() => dispatch({ type: "RESET_GAME" })}
              className="w-full text-md font-bold py-2 rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            >
              {t("newGame")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;

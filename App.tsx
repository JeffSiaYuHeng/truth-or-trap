
import React, { useReducer, useMemo, createContext } from 'react';
import { GameState, GameScreen as Screen, AppContextType } from './types';
import { gameReducer, initialState } from './hooks/gameReducer';
import { LocalizationProvider } from './context/LocalizationContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    try {
      const storedState = localStorage.getItem('truthOrTrapState');
      if (storedState) {
        const parsedState = JSON.parse(storedState) as GameState;
        // Ensure functions are not persisted, start fresh if screen is mid-game
        if (parsedState.currentScreen === Screen.GAME) {
            parsedState.currentScreen = Screen.SETUP;
        }
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
    return init;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('truthOrTrapState', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);
  
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case Screen.SETUP:
        return <SetupScreen />;
      case Screen.GAME:
        return <GameScreen />;
      default:
        return <SetupScreen />;
    }
  };

  return (
    <LocalizationProvider language={state.language} setLanguage={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}>
      <AppContext.Provider value={contextValue}>
        <div className="bg-gray-100 min-h-screen text-gray-900 font-sans antialiased">
            {renderScreen()}
        </div>
      </AppContext.Provider>
    </LocalizationProvider>
  );
};

export default App;
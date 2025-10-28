import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'fishing-game-state-v1';

const defaultState = {
  balance: 1000,
  ownedEquipment: [],
  selectedLocationId: null,
  tutorialSeen: false,
};

function initialiseState() {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }

    const parsed = JSON.parse(stored);
    return { ...defaultState, ...parsed };
  } catch (error) {
    console.warn('Не удалось прочитать состояние игры из localStorage', error);
    return defaultState;
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'EARN': {
      const nextBalance = state.balance + action.amount;
      return { ...state, balance: nextBalance };
    }
    case 'SPEND': {
      const nextBalance = Math.max(0, state.balance - action.amount);
      return { ...state, balance: nextBalance };
    }
    case 'ADD_EQUIPMENT': {
      const alreadyOwned = state.ownedEquipment.some(item => item.id === action.item.id);
      if (alreadyOwned) {
        return state;
      }
      return {
        ...state,
        ownedEquipment: [...state.ownedEquipment, action.item],
      };
    }
    case 'SET_LOCATION': {
      return { ...state, selectedLocationId: action.locationId };
    }
    case 'MARK_TUTORIAL': {
      return { ...state, tutorialSeen: true };
    }
    case 'RESET_STATE': {
      return { ...defaultState };
    }
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, defaultState, initialiseState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const totalRareChance = state.ownedEquipment.reduce(
      (total, item) => total + (item.rareChance ?? 0),
      0,
    );

    return {
      ...state,
      totalRareChance,
      earnBalance: amount => dispatch({ type: 'EARN', amount }),
      spendBalance: amount => dispatch({ type: 'SPEND', amount }),
      addEquipment: item => dispatch({ type: 'ADD_EQUIPMENT', item }),
      setLocation: locationId => dispatch({ type: 'SET_LOCATION', locationId }),
      markTutorialSeen: () => dispatch({ type: 'MARK_TUTORIAL' }),
      resetState: () => dispatch({ type: 'RESET_STATE' }),
    };
  }, [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame необходимо вызывать внутри <GameProvider>.');
  }
  return context;
}

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { tournamentTaskMap, tournamentTasksByTournament } from '../data/tournaments.js';

const STORAGE_KEY = 'fishing-game-state-v1';

const defaultState = {
  balance: 1000,
  ownedEquipment: [],
  selectedLocationId: null,
  tutorialSeen: false,
  joinedTournaments: [],
  tournamentTaskProgress: {},
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
    case 'JOIN_TOURNAMENT': {
      if (state.joinedTournaments.includes(action.tournamentId)) {
        return state;
      }

      const taskProgress = { ...state.tournamentTaskProgress };
      (action.taskIds ?? []).forEach(taskId => {
        if (!taskProgress[taskId]) {
          taskProgress[taskId] = { progress: 0, claimed: false };
        }
      });

      return {
        ...state,
        joinedTournaments: [...state.joinedTournaments, action.tournamentId],
        tournamentTaskProgress: taskProgress,
      };
    }
    case 'ADVANCE_TOURNAMENT_TASK': {
      const task = tournamentTaskMap[action.taskId];
      if (!task) {
        return state;
      }

      const current = state.tournamentTaskProgress[action.taskId] ?? {
        progress: 0,
        claimed: false,
      };

      const nextProgress = Math.min(task.goal, current.progress + (action.amount ?? 1));
      if (nextProgress === current.progress) {
        return state;
      }

      return {
        ...state,
        tournamentTaskProgress: {
          ...state.tournamentTaskProgress,
          [action.taskId]: { ...current, progress: nextProgress },
        },
      };
    }
    case 'CLAIM_TOURNAMENT_TASK': {
      const current = state.tournamentTaskProgress[action.taskId];
      if (!current || current.claimed !== false) {
        return state;
      }

      return {
        ...state,
        tournamentTaskProgress: {
          ...state.tournamentTaskProgress,
          [action.taskId]: { ...current, claimed: true },
        },
      };
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

    const recordCatchForTournaments = catchInfo => {
      const info = catchInfo ?? {};
      state.joinedTournaments.forEach(tournamentId => {
        const taskIds = tournamentTasksByTournament[tournamentId] ?? [];
        taskIds.forEach(taskId => {
          const task = tournamentTaskMap[taskId];
          if (!task) {
            return;
          }

          switch (task.type) {
            case 'catch_total':
              dispatch({ type: 'ADVANCE_TOURNAMENT_TASK', taskId, amount: 1 });
              break;
            case 'catch_weight':
              if (info.weight >= (task.minWeight ?? 0)) {
                dispatch({ type: 'ADVANCE_TOURNAMENT_TASK', taskId, amount: 1 });
              }
              break;
            case 'catch_rarity':
              if ((task.rarities ?? []).includes(info.rarity)) {
                dispatch({ type: 'ADVANCE_TOURNAMENT_TASK', taskId, amount: 1 });
              }
              break;
            default:
              break;
          }
        });
      });
    };

    return {
      ...state,
      totalRareChance,
      earnBalance: amount => dispatch({ type: 'EARN', amount }),
      spendBalance: amount => dispatch({ type: 'SPEND', amount }),
      addEquipment: item => dispatch({ type: 'ADD_EQUIPMENT', item }),
      setLocation: locationId => dispatch({ type: 'SET_LOCATION', locationId }),
      markTutorialSeen: () => dispatch({ type: 'MARK_TUTORIAL' }),
      resetState: () => dispatch({ type: 'RESET_STATE' }),
      joinTournament: (tournamentId, taskIds) =>
        dispatch({ type: 'JOIN_TOURNAMENT', tournamentId, taskIds }),
      advanceTournamentTask: (taskId, amount = 1) =>
        dispatch({ type: 'ADVANCE_TOURNAMENT_TASK', taskId, amount }),
      claimTournamentTask: taskId => dispatch({ type: 'CLAIM_TOURNAMENT_TASK', taskId }),
      recordCatchForTournaments,
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

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Timer = {
  id: string;
  duration: number;
  category: string;
  remaining: number;
  status: "Paused" | "Running" | "Completed";
};

type TimerContextType = {
  timers: Timer[];
  history: { category: string; completionTime: string }[];
  addTimer: (timer: { duration: string; category: string }) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  decrementTime: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const initialState = {
  timers: [] as Timer[],
  history: [] as { category: string; completionTime: string }[],
};

type TimerAction =
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "UPDATE_TIMER"; payload: Partial<Timer> & { id: string } }
  | {
      type: "ADD_TO_HISTORY";
      payload: { category: string; completionTime: string };
    };

const timerReducer = (
  state: typeof initialState,
  action: TimerAction
): typeof initialState => {
  switch (action.type) {
    case "ADD_TIMER":
      return { ...state, timers: [...state.timers, action.payload] };
    case "UPDATE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, ...action.payload }
            : timer
        ),
      };
    case "ADD_TO_HISTORY":
      const updatedHistory = [...state.history, action.payload];
      AsyncStorage.setItem("timerHistory", JSON.stringify(updatedHistory));
      return { ...state, history: updatedHistory };
    default:
      return state;
  }
};

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  const addTimer = (timer: { duration: string; category: string }): void => {
    const id = Date.now().toString();
    dispatch({
      type: "ADD_TIMER",
      payload: {
        id,
        category: timer.category,
        duration: parseInt(timer.duration, 10),
        remaining: parseInt(timer.duration, 10),
        status: "Paused",
      },
    });
  };

  const startTimer = (id: string): void => {
    dispatch({ type: "UPDATE_TIMER", payload: { id, status: "Running" } });
  };

  const pauseTimer = (id: string): void => {
    dispatch({ type: "UPDATE_TIMER", payload: { id, status: "Paused" } });
  };

  const resetTimer = (id: string): void => {
    const timer = state.timers.find((t) => t.id === id);
    if (timer) {
      dispatch({
        type: "UPDATE_TIMER",
        payload: { id, remaining: timer.duration, status: "Paused" },
      });
    }
  };

  const decrementTime = useCallback(() => {
    state.timers.forEach((timer) => {
      if (timer.status === "Running" && timer.remaining > 0) {
        dispatch({
          type: "UPDATE_TIMER",
          payload: { id: timer.id, remaining: timer.remaining - 1 },
        });

        if (timer.remaining - 1 === 0) {
          dispatch({
            type: "UPDATE_TIMER",
            payload: { id: timer.id, status: "Completed" },
          });
          dispatch({
            type: "ADD_TO_HISTORY",
            payload: {
              category: timer.category,
              completionTime: new Date().toISOString(),
            },
          });
        }
      }
    });
  }, [state.timers]);

  return (
    <TimerContext.Provider
      value={{
        ...state,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        decrementTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext(): TimerContextType {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}

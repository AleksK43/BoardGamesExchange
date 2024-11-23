import { createContext } from 'react';

interface TransitionContextType {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
}

export const TransitionContext = createContext<TransitionContextType | undefined>(undefined);
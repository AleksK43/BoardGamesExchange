import React, { useState } from 'react';
import { TransitionContext } from './TransitionContext';

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <TransitionContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </TransitionContext.Provider>
  );
};
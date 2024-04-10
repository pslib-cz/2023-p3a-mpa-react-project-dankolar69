import React, { createContext, useState, ReactNode, useReducer } from 'react';
import { GameState} from '../components/GameReducer';
import gameReducer from '../components/GameReducer';
import { initialState } from '../components/GameReducer';




export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
    {children}
    
  </GameContext.Provider>
  );
};

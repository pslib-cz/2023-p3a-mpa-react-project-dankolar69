import React, { createContext, useState, ReactNode, useReducer } from 'react';
import { GameState} from '../reducers/GameReducer';
import gameReducer from '../reducers/GameReducer';
import { initialState } from '../reducers/GameReducer';




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

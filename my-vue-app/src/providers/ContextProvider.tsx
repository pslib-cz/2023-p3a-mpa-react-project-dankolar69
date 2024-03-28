import React, { createContext, useState, ReactNode, useReducer } from 'react';
import { GameState} from '../components/GameReducer';
import gameReducer from '../components/GameReducer';

export const initialState: GameState = {
  playerPosition: { id: 'player', x: window.innerWidth / 2, y: window.innerHeight / 2 },
  asteroids: [],
  bullets: [],
  enemies: [],
  enemyBullets: [],
  gameOver: false,
  score: 0,
};


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

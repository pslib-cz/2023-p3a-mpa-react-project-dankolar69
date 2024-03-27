import React, { PropsWithChildren, createContext, useState } from 'react';

type GameState = {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  return (
    <GameContext.Provider value={{ score, setScore, gameOver, setGameOver }}>
      {children}
    </GameContext.Provider>
  );
};
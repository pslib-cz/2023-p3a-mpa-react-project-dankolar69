import React, { createContext, useState, ReactNode } from 'react';

interface GameContextType {
  score: number;
  setScore: (value: number | ((prevVar: number) => number)) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
}

const defaultState = {
  score: 0,
  setScore: () => {},
  gameOver: false,
  setGameOver: () => {},
};

export const GameContext = createContext<GameContextType>(defaultState);

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  return (
    <GameContext.Provider value={{ score, setScore, gameOver, setGameOver }}>
      {children}
    </GameContext.Provider>
  );
};

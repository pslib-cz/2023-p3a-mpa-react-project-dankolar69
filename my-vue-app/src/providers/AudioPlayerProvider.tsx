import React, { PropsWithChildren, useState } from 'react';

export const AudioPlayerContext = React.createContext({
    isPlaying: false,
    setIsPlaying: (isPlaying: boolean) => {},
  });
  

export const AudioPlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <AudioPlayerContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
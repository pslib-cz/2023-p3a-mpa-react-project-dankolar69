import React from 'react';

type PlayerProps = {
  position: { x: number; y: number; };
};

const Player: React.FC<PlayerProps> = ({ position }) => (
  <div
    style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      height: '50px',
      width: '50px',
      backgroundColor: 'white',
      transition: 'top 0.2s, left 0.2s',
    }}
  />
);

export default Player;
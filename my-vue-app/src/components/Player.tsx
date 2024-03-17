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
    }}
  />
);

export default Player;
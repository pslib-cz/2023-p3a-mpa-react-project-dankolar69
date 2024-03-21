import React from 'react';

type AsteroidProps = {
  position: { x: number; y: number; };
};

const Asteroid: React.FC<AsteroidProps> = ({ position }) => (
  <div
    style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      height: '50px',
      width: '50px',
      backgroundColor: 'gray',
      transition: 'top 0.1s, left 0.1s'
    }}
  />
);

export default Asteroid;
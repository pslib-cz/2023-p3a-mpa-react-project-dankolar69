
import React from 'react';

type BulletProps = {
  position: { x: number; y: number; };
};

const Bullet: React.FC<BulletProps> = ({ position }) => (
  <div
    style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      height: '10px',
      width: '10px',
      backgroundColor: 'white',
      transition: 'top 0.1s, left 0.1s'
    }}
  />
);

export default Bullet;
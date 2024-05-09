
import React from 'react';
import laser from "../assets/images/laser.png";
import bigLaser from "../assets/images/bigLaser.png";
import { useEffect } from 'react';

type BulletProps = {
  position: { x: number; y: number; };
};

const MegaBullet: React.FC<BulletProps> = ({ position }) => ( 
  <div className='megaBullet no-select' style={{
    position: 'absolute',
    top: position.y,
    left: position.x,
    height: '40px',
    width: '15px',
    transition: 'top 0.2s, left 0.2s',
  }}>
      <img
      src={bigLaser}
      alt="bigLaser"
      style={{
          width: '100%',
          height: '100%',
      }}
        />
    </div>
);
const Bullet: React.FC<BulletProps & { direction?: string }> = ({ position, direction }) => {
  let leftOffset = 0;
  let topOffset = 0;

  switch (direction) {
    case 'left':
      leftOffset = -1;  
      topOffset = 1;
      break;
    case 'right':
      leftOffset = 1;   
      topOffset = 1;
      break;
    default:
      topOffset = 1; 
      break;
  }

  const updatePosition = () => ({
    x: position.x + leftOffset,
    y: position.y + topOffset,
  });

  
  useEffect(() => {
    const interval = setInterval(() => {
      position = updatePosition();
    }, 100);
    return () => clearInterval(interval);
  }, [position]);

  return (
    <div className='bullet no-select' style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      height: '40px',
      width: '5px',
      transition: 'top 0.2s, left 0.2s',
    }}>
      <img src={laser} alt="Laser" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
export { Bullet, MegaBullet };
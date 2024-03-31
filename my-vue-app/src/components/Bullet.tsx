
import React from 'react';
import laser from "../assets/images/laser.png";

type BulletProps = {
  position: { x: number; y: number; };
};

const Bullet: React.FC<BulletProps> = ({ position }) => (
  
  <div style={{
    position: 'absolute',
    top: position.y,
    left: position.x ,
    height: '40px',
    width: '5px',
    
    transition: 'top 0.2s, left 0.2s',
  }}>
      <img
      src={laser}
      alt="Laser"
      style={{
          width: '100%',
          height: '100%',
      }}
        />
    </div>
);

export default Bullet;
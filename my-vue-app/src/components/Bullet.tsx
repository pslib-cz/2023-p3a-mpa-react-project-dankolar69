
import React from 'react';
import laser from "../assets/images/laser.png";

type BulletProps = {
  position: { x: number; y: number; };
};

const Bullet: React.FC<BulletProps> = ({ position }) => (
  
  <div>
      <img
      src={laser}
      alt="Laser"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x ,
        height: '40px',
        width: '5px',
        
        transition: 'top 0.2s, left 0.2s',
      }}
        />
    </div>
);

export default Bullet;
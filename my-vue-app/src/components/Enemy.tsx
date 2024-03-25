import React from "react";
import enemy1 from "../assets/images/enemy1.png";

type EnemyProps = {
    position: { x: number; y: number; };
  };

  export type EnemyBullet = {
    x: number;
    y: number;
    id: string;
  };

  const Enemy: React.FC<EnemyProps> = ({ position }) => (
    
    <div>
      <img
      src={enemy1}
      alt="Enemy"
      style={{
        position: 'absolute',
        top: position.y - 80,
        left: position.x - 50,
        height: '100px',
        width: '100px',
        
        transition: 'top 0.2s, left 0.2s',
      }}
        />
    </div>
  );
  
  export default Enemy;
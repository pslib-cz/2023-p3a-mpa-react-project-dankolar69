import React from "react";
import enemy1 from "../assets/images/enemy1.png";

type EnemyProps = {
    position: { x: number; y: number; };
  };


  const Enemy: React.FC<EnemyProps> = ({ position }) => (
    <div>
      <img
      src={enemy1}
      alt="Enemy"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        height: '50px',
        width: '50px',
        
        transition: 'top 0.2s, left 0.2s',
      }}
        />
    </div>
  );
  
  export default Enemy;
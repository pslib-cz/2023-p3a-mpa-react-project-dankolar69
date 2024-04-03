import React from "react";
import enemy1 from "../assets/images/enemy1.png";
import enemy2 from "../assets/images/enemy2.png";
import enemy3 from "../assets/images/enemy3.png";

type EnemyProps = {
    position: { x: number; y: number; };
    
  };

  export type EnemyBullet = {
    x: number;
    y: number;
    id: string;
    type: string;
  };

  export const Enemy1: React.FC<EnemyProps> = ({ position}) => (
    
    
    <div style={{
      position: 'absolute',
      top: position.y, 
      left: position.x , 
      height: '100px',
      width: '100px', 
      transition: 'top 0.5s ease-out, left 0.5s ease-out',
    transform: 'translateZ(0)',
    }}>
      <img
      src={enemy1}
      alt="Enemy"
      style={{
        height: '100%', 
        width: '100%', 
      }}
      
        />
    </div>
  );

  export const Enemy2: React.FC<EnemyProps> = ({ position}) => (
      
      <div style={{
        position: 'absolute',
        top: position.y , 
        left: position.x, 
        height: '100px', 
        width: '100px', 
        transition: 'top 0.5s ease-out, left 0.5s ease-out',
    transform: 'translateZ(0)',
      }}>
        <img
        src={enemy2}
        alt="Enemy2"
        style={{
          height: '100%', 
          width: '100%', 
        }}
          />
      </div>
    );
  
    export const Enemy3: React.FC<EnemyProps> = ({ position }) => (
      <div  style={{
        position: 'absolute',
        top: position.y - 80,
        left: position.x - 50,
        height: '100px',
        width: '100px',
        transition: 'top 0.2s, left 0.2s',
      }}>
    
        <img
          src={enemy3}
          alt="Enemy3"
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div>
    );
    
  
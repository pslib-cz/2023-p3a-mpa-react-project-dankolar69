import React from "react";
import boss1 from "../assets/images/boss1.png";

type BossProps = {
    position: { x: number; y: number; };
    
  };

  

  export const Boss1: React.FC<BossProps> = ({ position}) => (
    
    <div className="boss no-select" style={{
      position: 'absolute',
      top: position.y , 
      left: position.x , 
      height: '120px', 
      width: '120px',
      transition: 'top 0.5s, left 0.5s', 
    }}>
      <img
      src={boss1}
      alt="Boss"
      style={{
        height: '100%', 
        width: '100%', 
      }}
      
        />
    </div>
  );
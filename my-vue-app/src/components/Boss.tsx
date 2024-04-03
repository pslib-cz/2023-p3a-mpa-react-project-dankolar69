import React from "react";
import boss1 from "../assets/images/boss1.png";

type BossProps = {
    position: { x: number; y: number; };
    
  };

  

  export const Boss1: React.FC<BossProps> = ({ position}) => (
    
    <div style={{
      position: 'absolute',
      top: position.y , // Adjust based on your design needs
      left: position.x , // Adjust based on your design needs
      height: '120px', // This can be adjusted or made dynamic as needed
      width: '120px', // This can be adjusted or made dynamic as needed
      transition: 'top 0.2s, left 0.2s', // Smooths the movement
    }}>
      <img
      src={boss1}
      alt="Enemy"
      style={{
        height: '100%', // Ensures the image fills the div container
        width: '100%', // Ensures the image fills the div container
      }}
      
        />
    </div>
  );
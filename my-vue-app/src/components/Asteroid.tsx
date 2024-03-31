import React from 'react';
import "../styles/Gameplay.css";

type AsteroidProps = {
  position: { x: number; y: number; };
  image?: string;
};


const Asteroid: React.FC<AsteroidProps> = ({ position, image }) => (
  <div style={{
    position: 'absolute',
    top: position.y,
    left: position.x,
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    overflow: 'hidden',     
    objectFit: 'cover',
    
    transition: 'top 0.1s, left 0.1s',
    animation: 'spin 2s linear infinite',
  }}>
    <img
    src={image}
    alt="Asteroid"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      
      
    }}
      />
  </div>
);

export default Asteroid;
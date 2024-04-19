import React from 'react';
import "../styles/Gameplay.css";

type AsteroidProps = {
  position: { x: number; y: number; };
  image?: string;
};


const Asteroid: React.FC<AsteroidProps> = ({ position, image }) => (
  <div className='asteroid' style={{
    position: 'absolute',
    top: position.y,
    left: position.x,
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    overflow: 'hidden',     
    objectFit: 'cover',
    
    boxShadow: '0 0 10px rgba(255,255,255,0.5)', // Přidání stínu
    transition: 'top 0.2s ease-out, left 0.2s ease-out', // Plynulejší pohyb
    animation: 'spin 4s linear infinite',
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
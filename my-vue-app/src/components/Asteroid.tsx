import React from 'react';


type AsteroidProps = {
  position: { x: number; y: number; };
  image: string;
};


const Asteroid: React.FC<AsteroidProps> = ({ position, image }) => (
  <div>
    <img
    src={image}
    alt="Asteroid"
    style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      height: '50px',
      width: '50px',
      borderRadius: '50%',
      overflow: 'hidden',     
      objectFit: 'cover',
      
      transition: 'top 0.1s, left 0.1s',
    }}
      />
  </div>
);

export default Asteroid;
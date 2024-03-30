import React from 'react';
import playerImage from '../assets/images/playerImage.png';


type PlayerProps = {
  position: { x: number; y: number; };
};

const Player: React.FC<PlayerProps> = ({ position }) => (
  <div>
    <img
    src={playerImage}
    alt="Player"
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

export default Player;
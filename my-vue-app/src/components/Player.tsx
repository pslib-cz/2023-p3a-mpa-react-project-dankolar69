import React from 'react';
import playerImage from '../assets/images/playerImage.png';
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';

type PlayerProps = {
  position: { x: number; y: number; };
};


// Funkce pro pohyb hráče pomocí klávesnice
export function playerMovement(): void {
  const { state, dispatch } = useContext(GameContext);
  const handleKeyDown = (event: KeyboardEvent) => {
    switch(event.code) {
      case 'ArrowUp':
        dispatch({ type: 'MOVE_PLAYER_UP' });
        break;
      case 'ArrowDown':
        dispatch({ type: 'MOVE_PLAYER_DOWN' });
        break;
      case 'ArrowLeft':
        dispatch({ type: 'MOVE_PLAYER_LEFT' });
        break;
      case 'ArrowRight':
        dispatch({ type: 'MOVE_PLAYER_RIGHT' });
        break;
      case 'Space':
        event.preventDefault(); 
        console.log('Space pressed');
        dispatch({ type: 'ADD_BULLET', payload: { playerPosition: state.playerPosition } });
        break;
      
    }
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    let direction;
    switch (event.code) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
        case 'Space':
            return;
        default:
            return; 
    }
    
    dispatch({ type: 'STOP_MOVE_PLAYER', payload: { direction } });
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', (event) => {
      console.log(`Pressed key: ${event.code}`);
    });
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch]);
}


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
      transition: 'top 0.2s ease-out, left 0.2s ease-out', 
        transform: 'translateZ(0)',
      
    }}
      />
  </div>
);

export default Player;
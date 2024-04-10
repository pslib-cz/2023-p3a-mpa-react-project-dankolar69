import React from 'react';
import playerImage from '../assets/images/playerImage.png';
import { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../providers/ContextProvider';

import engine2 from '../assets/images/engine2.png';
import engine from '../assets/images/engine.png';

type PlayerProps = {
  position: { x: number; y: number; };
};


// Funkce pro pohyb hráče pomocí klávesnice
export function playerMovement(): void {
  const { state, dispatch } = useContext(GameContext);

  // omezení střelby
  const lastBulletTime = useRef(0);
  let bulletCooldown = 500; 

  // Zkontroluje, zda hráč vlastní upgrade "Fire rate" a upraví cooldown střelby
  const fireRateUpgrade = state.upgrades.find(upgrade => upgrade.name === 'Fire rate' && upgrade.owned);
  if (fireRateUpgrade) {
    bulletCooldown = 200;
  }


  const handleKeyDown = (event: KeyboardEvent) => {
    const currentTime = Date.now();
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
        if (currentTime - lastBulletTime.current >= bulletCooldown) {
          console.log('Space pressed');
          dispatch({ type: 'ADD_BULLET', payload: { playerPosition: state.playerPosition } });
          lastBulletTime.current = currentTime;
        }
        break;

        case 'KeyQ':
          if (!state.invincibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invincibility' && upgrade.owned)) {
            dispatch({ type: 'ACTIVATE_INVINCIBILITY', payload: { duration: 10, cooldown: 30 } }); // Předpokládáme 10s neviditelnost a 30s cooldown
            let invincibilityDuration = 10;
        
            const invincibilityTimer = setInterval(() => {
              invincibilityDuration -= 1;
              dispatch({ type: 'DECREMENT_INVINCIBILITY_TIMER', payload: { timeLeft: invincibilityDuration } });
        
              if (invincibilityDuration <= 0) {
                clearInterval(invincibilityTimer);
                dispatch({ type: 'RESET_INVINCIBILITY' });
        
                let cooldownDuration = 30;
                const cooldownTimer = setInterval(() => {
                  cooldownDuration -= 1;
                  dispatch({ type: 'DECREMENT_COOLDOWN_TIMER', payload: { timeLeft: cooldownDuration } });
        
                  if (cooldownDuration <= 0) {
                    clearInterval(cooldownTimer);
                    dispatch({ type: 'RESET_INVINCIBILITY_COOLDOWN' });
                  }
                }, 1000);
              }
            }, 1000);
          }
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
        case 'KeyQ':
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

function getFlameImageByMovement(activeDirections: { [key: string]: boolean }) {
  const directionsCount = Object.values(activeDirections).filter(Boolean).length;

  // Simple logic: More directions pressed = higher intensity flame
  if (directionsCount > 1) {
    return engine2; // Most intense flame
  } else if (directionsCount === 1) {
    return engine; // Medium flame
  }
  else {
    return null;
  }
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  const { state } = useContext(GameContext);
  
  const flameImage = getFlameImageByMovement(state.activeDirections);

return (

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
        opacity: state.isInvincible ? 0.5 : 1,
      
    }}

      />
      {flameImage && (
      <img
        src={flameImage}
        alt="Flame"
        style={{
          position: 'absolute',
          bottom: '-10px',
          transform: 'translateX(0%)',
          transition: 'top 0.2s ease-out, left 0.2s ease-out',
          top: position.y +40,
          left: position.x +15,
        }}
      />
      )}
  </div>
)};


export default Player;
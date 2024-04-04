import React from "react";
import "../styles/Gameplay.css";
import Player from "../components/Player";
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';
import { playerMovement } from "../components/Player";
import Bullet from "../components/Bullet";
import { Boss1 } from "../components/Boss";

import { useNavigate } from "react-router-dom";


const BossFight: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);
    const navigate = useNavigate();


    // Pohyb hráče pomocí klávesnice
    playerMovement();
    
    // práce s logikou z reduceru

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_BOSSFIGHT_STATE'});
      dispatch({ type: 'UPDATE_PLAYER_MOVEMENT'});
    }, 100); 

    
    return () => clearInterval(interval);

  }, [dispatch]);

  
  useEffect(() => {
    
    const moveBoss = () => {
      // Zajištění, že se pohyb vyvolá pouze ve fázi 2 a boss není v procesu útoku (isCharging)
      if (state.bossPhase === 2 && !state.bossPosition.isCharging) {
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        dispatch({
          type: 'MOVE_BOSS',
          payload: {
            direction: direction,
            movementSpeed: 100,
          }
        });
      }
    }
    // Nastavení intervalu pro pravidelnou aktualizaci
    const intervalId = setInterval(moveBoss, 1000); // Aktualizuje pozici bosse každou sekundu
  
    // Cleanup funkce pro odstranění intervalu při odmountování komponenty
    return () => clearInterval(intervalId);
  }, [dispatch, state.bossPhase, state.bossPosition.isCharging]); 
  // smrt hráče nebo výhra
  useEffect(() => {
    if (state.lives <= 0) {
      navigate('/dead');
    }
    
  });
  const bossHealthWidth = (state.bossLives / 3) * 20 ;
  
    
    return (
        <div className="gameplay-container">
            <h1 style={{ color: 'white' }}>Boss Fight</h1>
            <h2 style={{ color: 'white' }}>Boss Phase: {state.bossPhase}</h2>
            <h2 style={{ color: 'white' }}>Lives: {state.lives}</h2>
            
            <Player position={state.playerPosition} />
            {state.bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet} />

      ))}
      <div style={{ position: 'absolute', top: state.bossPosition.y - 15, left: state.bossPosition.x +55, transform: 'translateX(-50%)' }}>
        
        <div className="boss-health-bar-container">
          <div className="boss-health-bar" style={{ width: bossHealthWidth }}></div>
        </div>
      </div>
      <Boss1 position={state.bossPosition} />
      
      {state.enemyBullets.map(bullet => (
        
        <Bullet key={bullet.id} position={bullet} />
      ))}
      
        </div>
    );
};

export default BossFight;
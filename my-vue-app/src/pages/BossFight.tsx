import React from "react";
import "../styles/Gameplay.css";

import Player from "../components/Player";
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';

import {MegaBullet, Bullet} from "../components/Bullet";
import { Boss1 } from "../components/Boss";
import { Enemy3 } from "../components/Enemy";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import InvincibilityTimer from "../components/InvisibilityTimer";
import BigShotTimer from "../components/BigShotTimer";


const BossFight: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);
    const navigate = useNavigate();
    


    
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
      if (state.bossPhase === 2 && !state.bossPosition.isCharging || state.bossPhase === 3 && !state.bossPosition.isCharging) {
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
   
    const intervalId = setInterval(moveBoss, 1000);
  
  
    return () => clearInterval(intervalId);
  }, [dispatch, state.bossPhase, state.bossPosition.isCharging]); 

  // smrt hráče nebo pokračování do další fáze hry
  useEffect(() => {
    if (state.lives <= 0) {
      
      navigate('/dead');
  } else if (state.bossLives <= 0 && state.bossPhase === 3) {
      state.score + 3;
      dispatch({ type: 'PREPARE_FOR_CONTINUED_GAMEPLAY' }); 
      dispatch({type: 'RESET_BIG_SHOT_COOLDOWN'})
      dispatch({type: 'RESET_INVISIBILITY'})
      dispatch({type: 'RESET_INVISIBILITY_COOLDOWN'})
      navigate('/gameplay'); 
  }
    
  });

  
  const bossHealthWidth = (state.bossLives / 10) * 100 ;
  
    
    return (
        <div className="gameplay-container">
          
            
            <div className='gameplay-stats'>
                <h1>Boss Fight</h1>
                <h1>Score: {state.score}</h1>
                <h2>Currency: {state.currency}</h2>
                <h2>Lives: {state.lives}</h2>
                <div className="invincibilityTimer">
                  <InvincibilityTimer/>
                </div>
                <div className="bigShotTimer">
                  <BigShotTimer />
                </div>
                <div className="audioPlayer">
                  <AudioPlayer />
                </div>
          </div>

            
            <Player position={state.playerPosition} />
            {state.bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet} />

      ))}
      {state.megaBullets.map(bullet => (
        <MegaBullet key={bullet.id} position={bullet} />
      ))}
      
        
        <div style={{  top: state.bossPosition.y - 55 , left: state.bossPosition.x +55 }} className="boss-health-bar-container">
          <div className="boss-health-bar" style={{ width: bossHealthWidth }}></div>
        </div>
      
      <Boss1 position={state.bossPosition} />

      {state.enemies.map(enemy => (enemy.type === 'enemy3' ? <Enemy3 key={enemy.id} position={enemy} /> : null))}
      {state.enemyBullets.map(bullet => (
        
        <Bullet key={bullet.id} position={bullet} />
      ))}
      
        </div>
    );
};

export default BossFight;
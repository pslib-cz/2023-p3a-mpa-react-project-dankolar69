import React, { useContext, useEffect, useRef , useState} from 'react';
import { GameContext } from '../providers/ContextProvider'; 
import Player from '../components/Player';
import Asteroid from '../components/Asteroid';
import {Bullet, MegaBullet} from '../components/Bullet';
import {Enemy1} from '../components/Enemy';
import {Enemy2} from '../components/Enemy';
import { useNavigate } from 'react-router-dom';
import { playerMovement } from '../components/Player';
import InvincibilityTimer from '../components/InvisibilityTimer';
import AudioPlayer from '../components/AudioPlayer';
import BlackHole from '../components/BlackHole';
import BigShotTimer from '../components/BigShotTimer';
import { detectCollision } from '../reducers/GameReducer';




const Gameplay = () => {
  const { state, dispatch } = useContext(GameContext);
  
  
  const navigate = useNavigate();

 


  // práce s logikou z reduceru
  // Update hry
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_GAMEPLAY_STATE'});
      dispatch({ type: 'UPDATE_PLAYER_MOVEMENT'});
    }, 100); 

    
   
    let addEntitiesInterval;
    if (state.score > 15) {
      addEntitiesInterval = setInterval(() => {
        dispatch({ type: 'ADD_ENEMY' });
      }, 1000); 
      
    } else {
      addEntitiesInterval = setInterval(() => {
        dispatch({ type: 'ADD_ENEMY' });
      }, 2000); 
    }
    const addEntitiesInterval2 = setInterval(() => {
      dispatch({ type: 'ADD_ENEMY_BULLET' });
      dispatch({ type: 'ADD_ASTEROID' });
      if (state.playerShrinking) {
    
            dispatch({ type: 'GAME_OVER' });
        

      
    }
    }, 1000);

    
     
  
    return () => {
      clearInterval(addEntitiesInterval) 
      clearInterval(interval)
      clearInterval(addEntitiesInterval2)
      };

    
  }, [dispatch, state.score, state.playerShrinking]);

  

  // Přidání asteroidů
  useEffect(() => {
    let addEntitiesInterval;
    if (state.score > 7) {
      addEntitiesInterval = setInterval(() => {
        dispatch({ type: 'ADD_BLACKHOLE' });
      }, 5000); 
    } 
    else {
      addEntitiesInterval = setInterval(() => {
        dispatch({ type: 'ADD_ASTEROID' });
      }, 1000); 
    }
   
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch, state.score]);

  useEffect(() => {
    state.blackHoles.forEach(blackHole => {
      if (detectCollision(state.playerPosition, blackHole, 50, 50, 100, 100)) {
          dispatch({ type: 'TRIGGER_BLACK_HOLE_EFFECT' });
      }
    });
    
  }, [dispatch, state.blackHoles, state.playerPosition]); 
  
  
  useEffect(() => {
    // smrt hráče
    if (state.lives <= 0 || state.gameOver == true) {
      
      navigate('/dead');
    }
    // Přechod na boss fight
    if (state.score == 3) {
      dispatch({type: 'RESET_BIG_SHOT_COOLDOWN'})
      dispatch({type: 'RESET_INVISIBILITY_COOLDOWN'})
      dispatch({type: 'RESET_INVISIBILITY'})
      state.enemyBullets = [];
      navigate('/boss');
    }
  });
  
  
  

  return (
    <div className="gameplay-container">
      <h1 style={{ color: 'white' }}>Score: {state.score}</h1>
      <h2 style={{ color: 'white' }}>Currency: {state.currency}</h2>
      <h2 style={{ color: 'white' }}>Lives: {state.lives}</h2>
      <InvincibilityTimer/>
      <BigShotTimer />
      <AudioPlayer  />

      <Player  position={state.playerPosition} />
      {state.asteroids.map(asteroid => (
        <Asteroid key={asteroid.id} position={asteroid} image={asteroid.image} />
      ))}
      {state.blackHoles.map(blackHole => (
        <BlackHole key={blackHole.id} position={blackHole} size={100} />
      ))}
      {state.bullets.map(bullet =>  
  
  <Bullet key={bullet.id} position={bullet} />

)}
      {state.megaBullets.map(megaBullet => (
        <MegaBullet key={megaBullet.id} position={megaBullet} />
      ))}
      {state.enemies.map(enemy => (
        enemy.type === 'enemy1' ? <Enemy1 key={enemy.id} position={enemy} /> : <Enemy2 key={enemy.id} position={enemy} /> 
      ))}
      {state.enemyBullets.map(bullet => (
        
        <Bullet key={bullet.id} position={bullet} />
      ))}
    </div>
  );
};

export default Gameplay;

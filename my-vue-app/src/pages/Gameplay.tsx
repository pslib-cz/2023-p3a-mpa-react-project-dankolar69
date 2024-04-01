import React, { useContext, useEffect, useRef , useState} from 'react';
import { GameContext } from '../providers/ContextProvider'; 
import Player from '../components/Player';
import Asteroid from '../components/Asteroid';
import Bullet from '../components/Bullet';
import {Enemy1} from '../components/Enemy';
import {Enemy2} from '../components/Enemy';
import { useNavigate } from 'react-router-dom';
import { playerMovement } from '../components/Player';





const Gameplay = () => {
  const { state, dispatch } = useContext(GameContext);
  
  
  const navigate = useNavigate();

  // Pohyb hráče pomocí klávesnice
  playerMovement();


  // práce s logikou z reduceru
  // Update hry
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_GAMEPLAY_STATE'});
      dispatch({ type: 'UPDATE_PLAYER_MOVEMENT'});
    }, 100); 

    return () => clearInterval(interval);
  }, [dispatch]);

  // Přidání nepřátel
  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      
      dispatch({ type: 'ADD_ENEMY' });
      
    }, 2000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  // Přidání asteroidů
  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      dispatch({ type: 'ADD_ASTEROID' });
      
      
    }, 1000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  // Přidání nepřátelských střel
  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      
      dispatch({ type: 'ADD_ENEMY_BULLET'});
      
    }, 1000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  
  // Přechod na boss fight
  if (state.score >= 3) {
    navigate('/boss');
  }
  
  // smrt hráče
  if (state.gameOver) {
    
      navigate('/dead');
    
  }

  return (
    <div className="gameplay-container">
      <h1 style={{ color: 'white' }}>Score: {state.score}</h1>
      <h2 style={{ color: 'white' }}>Lives: {state.lives}</h2>

      <Player  position={state.playerPosition} />
      {state.asteroids.map(asteroid => (
        <Asteroid key={asteroid.id} position={asteroid} image={asteroid.image} />
      ))}
      {state.bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet} />
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

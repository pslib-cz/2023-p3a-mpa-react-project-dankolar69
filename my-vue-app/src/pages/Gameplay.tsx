import React, { useContext, useEffect, useRef , useState} from 'react';
import { GameContext } from '../providers/ContextProvider'; 
import Player from '../components/Player';
import Asteroid from '../components/Asteroid';
import Bullet from '../components/Bullet';
import {Enemy1} from '../components/Enemy';
import {Enemy2} from '../components/Enemy';
import { useNavigate } from 'react-router-dom';





const Gameplay = () => {
  const { state, dispatch } = useContext(GameContext);
  
  const navigate = useNavigate();

  // Pohyb hráče pomocí klávesnice
  
  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  
  const handleKeyDown = (event: KeyboardEvent) => {
    keys.current = { ...keys.current, [event.key]: true };
  };
  
  const handleKeyUp = (event: KeyboardEvent) => {
    keys.current = { ...keys.current, [event.key]: false };
  };
  
  useEffect(() => {
    const movePlayer = () => {
      for (const direction in keys.current) {
        if (keys.current[direction as keyof typeof keys.current]) {
          dispatch({ type: 'MOVE_PLAYER', payload: { direction } });
        }
      }
    };
  
    const intervalId = setInterval(movePlayer, 50); //plynulý pohyb
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, keys]);

  // práce s logikou z reduceru
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_GAME_STATE'});
    }, 100); 

    return () => clearInterval(interval);
  }, [dispatch]);


  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      
      dispatch({ type: 'ADD_ENEMY' });
      
    }, 2000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      dispatch({ type: 'ADD_ASTEROID' });
      
      
    }, 1000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  useEffect(() => {
    const addEntitiesInterval = setInterval(() => {
      dispatch({ type: 'ADD_BULLET', playerPosition: state.playerPosition});
      dispatch({ type: 'ADD_ENEMY_BULLET'});
      
    }, 1000); 
  
    return () => clearInterval(addEntitiesInterval);
  }, [dispatch]);

  
  if (state.gameOver) {
    
      navigate('/dead');
    
  }

  return (
    <div className="gameplay-container">
      <Player position={state.playerPosition} />
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

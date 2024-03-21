import React, { useState, useEffect, useRef } from 'react';
import Bullet from './Bullet';
import Asteroid from './Asteroid';
import Player from './Player';
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";
import Enemy from '../components/Enemy';

type Position = {
    x: number;
    y: number;
    
    id?: number;
    image?: string;
};




const asteroidImages = [asteroid1, asteroid2];
let nextId = 0;

const Gameplay: React.FC = () => {
  const playerPosition = useRef<Position>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [asteroids, setAsteroids] = useState<Position[]>([]);
  const [bullets, setBullets] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [enemies, setEnemies] = useState<Position[]>([]);

  
  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (keysPressed.current['ArrowUp']) {
        playerPosition.current = { ...playerPosition.current, y: Math.max(playerPosition.current.y - 20, 0) };
      }
      if (keysPressed.current['ArrowDown']) {
        playerPosition.current = { ...playerPosition.current, y: Math.min(playerPosition.current.y + 20, window.innerHeight - 50) };
      }
      if (keysPressed.current['ArrowLeft']) {
        playerPosition.current = { ...playerPosition.current, x: Math.max(playerPosition.current.x - 20, 0) };
      }
      if (keysPressed.current['ArrowRight']) {
        playerPosition.current = { ...playerPosition.current, x: Math.min(playerPosition.current.x + 20, window.innerWidth - 50) };
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) => [...prev, { x: playerPosition.current.x + 25, y: playerPosition.current.y, id: nextId++ }]); 
    }, 1000);
    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      setAsteroids((prev) =>
        prev.map((asteroid) => {
          if (
            asteroid.x < playerPosition.current.x + 50 && 
            asteroid.x + 50 > playerPosition.current.x && 
            asteroid.y < playerPosition.current.y + 50 && 
            asteroid.y + 50 > playerPosition.current.y 
          ) {
            playerPosition.current = { x: 0, y: 0 }; 
            setGameOver(true);
          }

          return { ...asteroid, y: asteroid.y + 10 };
        })
      );
      setBullets((prevBullets) =>
      prevBullets.map((bullet) => ({ ...bullet, y: bullet.y - 30 }))
    );
      setBullets((prevBullets) =>
      prevBullets.filter((bullet) => {
        for (let i = 0; i < asteroids.length; i++) {
          const asteroid = asteroids[i];
          if (
            bullet.x < asteroid.x + 50 &&
            bullet.x + 10 > asteroid.x &&
            bullet.y < asteroid.y + 50 &&
            bullet.y + 10 > asteroid.y
          ) {
            
            setAsteroids((prevAsteroids) => prevAsteroids.filter((_, index) => index !== i));
            return false;
          }
        }
        return true;
      })
    );
  
      if (Math.random() < 0.10) {
        const newAsteroid = {
          x: Math.random() * window.innerWidth,
          y: 0,
          id: nextId++,
          image: asteroidImages[Math.floor(Math.random() * asteroidImages.length)],
        };
        setAsteroids((prev) => [...prev, newAsteroid]);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [asteroids]);

  if (gameOver) {
    return <div>Game Over</div>;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prev) =>
        prev.map((enemy) => ({
          ...enemy,
          y: enemy.y + 10,
        }))
      );
  
      /*enemies.forEach((enemy) => {
        if (Math.random() < 0.1) { 
          const newBullet = {
            x: enemy.x,
            y: enemy.y,
            id: nextId++,
          };
          setBullets((prev) => [...prev, newBullet]);
        }
      });*/
    }, 100);
    return () => clearInterval(interval);
  }, [enemies]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEnemy = {
        x: Math.random() * window.innerWidth,
        y: 0,
        id: nextId++,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        overflow: 'hidden'
      }}
    >
      <Player position={playerPosition.current} /> 
      {asteroids.map((asteroid) => (
      <Asteroid 
        key={asteroid.id} 
        position={asteroid} 
        image={asteroid.image ?? ''}
      />
      ))}
      {enemies.map((enemy) => (
      <Enemy key={enemy.id} position={enemy} />
    ))}
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet} />
      ))}
    </div>
  );
};

export default Gameplay;
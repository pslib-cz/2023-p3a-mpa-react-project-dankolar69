
import React, { useState, useEffect, useRef } from 'react';
import Bullet from './components/Bullet';
import Asteroid from './components/Asteroid';
import Player from './components/Player';



type Position = {
  x: number;
  y: number;
};

const App: React.FC = () => {
  const playerPosition = useRef<Position>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [asteroids, setAsteroids] = useState<Position[]>([]);
  const [bullets, setBullets] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        playerPosition.current = { ...playerPosition.current, y: Math.max(playerPosition.current.y - 10, 0) };
        break;
      case 'ArrowDown':
        playerPosition.current = { ...playerPosition.current, y: Math.min(playerPosition.current.y + 10, window.innerHeight - 50) };
        break;
      case 'ArrowLeft':
        playerPosition.current = { ...playerPosition.current, x: Math.max(playerPosition.current.x - 10, 0) };
        break;
      case 'ArrowRight':
        playerPosition.current = { ...playerPosition.current, x: Math.min(playerPosition.current.x + 10, window.innerWidth - 50) };
        break;
      default:
        break;
    }
  };
  
  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    playerPosition.current = { 
      x: Math.min(Math.max(event.touches[0].clientX - 25, 0), window.innerWidth - 50),
      y: Math.min(Math.max(event.touches[0].clientY - 25, 0), window.innerHeight - 50)
    };
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) => [...prev, { x: playerPosition.current.x + 25, y: playerPosition.current.y }]);
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
      prevBullets.map((bullet) => ({ ...bullet, y: bullet.y - 10 }))
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
        };
        setAsteroids((prev) => [...prev, newAsteroid]);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [asteroids]);

  if (gameOver) {
    return <div>Game Over</div>;
  }

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
      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} position={asteroid} />
      ))}
      {bullets.map((bullet, index) => (
        <Bullet key={index} position={bullet} />
      ))}
    </div>
  );
};

export default App;

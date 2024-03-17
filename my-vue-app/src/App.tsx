import React, { useState, useEffect, useRef } from 'react';

type Position = {
  x: number;
  y: number;
};

type Asteroid = Position;

const App: React.FC = () => {
  const playerPosition = useRef<Position>({ x: 0, y: 0 });
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        playerPosition.current = { ...playerPosition.current, y: playerPosition.current.y - 10 };
        break;
      case 'ArrowDown':
        playerPosition.current = { ...playerPosition.current, y: playerPosition.current.y + 10 };
        break;
      case 'ArrowLeft':
        playerPosition.current = { ...playerPosition.current, x: playerPosition.current.x - 10 };
        break;
      case 'ArrowRight':
        playerPosition.current = { ...playerPosition.current, x: playerPosition.current.x + 10 };
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
  
      if (Math.random() < 0.10) {
        const newAsteroid: Asteroid = {
          x: Math.random() * window.innerWidth,
          y: 0,
        };
        setAsteroids((prev) => [...prev, newAsteroid]);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (gameOver) {
    return <div>Game Over</div>;
  }
  
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: playerPosition.current.y,
          left: playerPosition.current.x,
          height: '50px',
          width: '50px',
          backgroundColor: 'white',
        }}
      />
      {asteroids.map((asteroid, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: asteroid.y,
            left: asteroid.x,
            height: '50px',
            width: '50px',
            backgroundColor: 'gray',
          }}
        />
      ))}
    </div>
  );
};

export default App;

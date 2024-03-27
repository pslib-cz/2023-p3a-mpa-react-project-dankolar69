import React, { useState, useEffect, useRef } from 'react';
import Bullet from './Bullet';
import Asteroid from './Asteroid';
import Player from './Player';
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";
import {Enemy1} from '../components/Enemy';
import {Enemy2} from '../components/Enemy';
import { EnemyBullet } from '../components/Enemy';
import fire from "../assets/images/fire.png";
import {v4 as uuidv4} from 'uuid';
import { Link } from 'react-router-dom';







type Position = {
  x: number;
  y: number;
  id?: string;
  image?: string;
  time?: number;
  direction?: number;
  type?: string;
};

const asteroidImages = [asteroid1, asteroid2];

//let nextId = 0;


const Gameplay: React.FC = () => {
  const playerPosition = useRef<Position>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [asteroids, setAsteroids] = useState<Position[]>([]);
  const [bullets, setBullets] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [enemies, setEnemies] = useState<Position[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<EnemyBullet[]>([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setScore] = useState(0);
 

  
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
      setBullets((prev) => [...prev, { x: playerPosition.current.x + 25, y: playerPosition.current.y, id: uuidv4()}]); 
    }, 1000);
    return () => clearInterval(interval);
  }, []); 

  

  
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      setAsteroids((prev) =>
        prev.map((asteroid) => {
          if (
            asteroid.x < playerPosition.current.x + 40 && 
            asteroid.x + 40 > playerPosition.current.x && 
            asteroid.y < playerPosition.current.y + 40 && 
            asteroid.y + 40 > playerPosition.current.y 
          ) {
            playerPosition.current = { x: 0, y: 0 }; 
            setGameOver(true);
          }

          return { ...asteroid, y: asteroid.y + 10 };
        })
        .filter((asteroid) => asteroid.y < window.innerHeight)
      );
      setBullets((prevBullets) =>
      prevBullets.map((bullet) => ({ ...bullet, y: bullet.y - 30 })).filter((bullet) => bullet.y >= 0)
    );
    setBullets((prevBullets) => {
      const newBullets = prevBullets.map((bullet) => ({ ...bullet, y: bullet.y - 30 }));
      const bulletsOnScreen = newBullets.filter((bullet) => bullet.y >= 0 && bullet.y <= window.innerHeight);
      for (let i = newBullets.length - 1; i >= 0; i--) {
        for (let j = 0; j < asteroids.length; j++) {
          if (
            asteroids[j].x < newBullets[i].x + 40 &&
            asteroids[j].x + 40 > newBullets[i].x &&
            asteroids[j].y < newBullets[i].y + 40 &&
            asteroids[j].y + 40 > newBullets[i].y
          ) {
            newBullets.splice(i, 1);
            break;
          }
        }
      }
      
      return bulletsOnScreen;

      
    });
      setBullets((prevBullets) =>
      
      prevBullets.filter((bullet) => {
        
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i];
          
          if (
            bullet.x < enemy.x + 40 &&
            bullet.x + 40 > enemy.x &&
            bullet.y < enemy.y + 40 &&
            bullet.y + 40 > enemy.y
          ) {
            setEnemies((prevEnemies) => prevEnemies.filter((e) => e.id !== enemy.id));
            setScore(prevScore => prevScore + .5);
            
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
          id: uuidv4(),
          image: asteroidImages[Math.floor(Math.random() * asteroidImages.length)],
        };
        setAsteroids((prev) => [...prev, newAsteroid]);
      }
      setEnemies((prev) =>
        prev.map((enemy) => {
          if (enemy.type === 'enemy2') {
            //enemy2
            return {
              ...enemy,
              y: enemy.y + 30,
            };
          } else {
            //enemy1
            const newTime = (enemy.time ?? 0) + 0.05 * (enemy.direction ?? 1 ?? 0);
            const newX = window.innerWidth / 2 + Math.sin(newTime) * window.innerWidth / 2;
            const newY = enemy.y + 10;

            

            if (
              newX < playerPosition.current.x + 40 &&
              newX + 40 > playerPosition.current.x &&
              newY < playerPosition.current.y + 40 &&
              newY + 40 > playerPosition.current.y
            ) {
              // If a collision occurs, set the game over state to true
              setGameOver(true);
            }
            
            return {
              ...enemy,
              x: newX,
              y: newY,
              time: newTime,
            };
          }
        }).filter((enemy) => enemy.y < window.innerHeight)
      );
      setEnemyBullets((prev) =>{
        const newBullets = prev.map((bullet) => { 
          //enemy2 faster bullet
          const speed = bullet.type === 'enemy2' ? 60 : 30;
          const newY = bullet.y + speed;


          if (
            bullet.x < playerPosition.current.x + 40 &&
            bullet.x + 40 > playerPosition.current.x &&
            newY < playerPosition.current.y + 40 &&
            newY + 40 > playerPosition.current.y
          ) {
            setGameOver(true);}
          return { ...bullet, y: newY };
             
        });
          const bulletsOnScreen = newBullets.filter((bullet) => bullet.y <= window.innerHeight);
          return bulletsOnScreen;
      }
            
    );
      
      enemies.forEach((enemy) => {
        
        if (Math.random() < 0.1) { 
          const newBullet = {
            x: enemy.x,
            y: enemy.y,
            id: uuidv4(),
            type: enemy.type ?? 'enemy1',
          };
          setEnemyBullets((prev) => [...prev, newBullet]);
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [enemies, asteroids]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEnemy = {
        x: Math.random() * window.innerWidth,
        y: 0,
        id: uuidv4(),
        time: 0,
        direction: Math.random() < 0.5 ? 1 : -1,
        type: Math.random() < 0.5 ? 'enemy1' : 'enemy2',
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  if (gameOver) {
    return (
      
      <div className='deadScreen'>
        <h1>Game Over</h1>
        <Link to="/">
          <button onClick={() => setScore(0)}>Main Menu</button>
        </Link>
      </div>
    );
  }

  return (
    <div className='gameplay-container'>
      <h1 style={{ color: 'white' }}>Score: {score}</h1>
      <Player position={playerPosition.current} /> 
      {asteroids.map((asteroid) => (
      <Asteroid 
        key={asteroid.id} 
        position={asteroid} 
        image={asteroid.image ?? ''}
      />
      ))}
      {enemies.map((enemy) => {
          if (enemy.type === 'enemy2') {
            return <Enemy2 key={enemy.id} position={enemy} />;
          } else {
            return <Enemy1 key={enemy.id} position={enemy} />;
          }
        })}
              
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet} />
      ))}
        {enemyBullets.map((bullet) => (
          <Bullet key={bullet.id} position={bullet} /> 
        ))}
        
    
    </div>
  );
};

export default Gameplay;



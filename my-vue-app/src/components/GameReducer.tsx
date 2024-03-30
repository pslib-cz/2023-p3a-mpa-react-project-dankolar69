import React from "react";

import { v4 as uuidv4 } from "uuid";
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";

function detectCollision(item1: Position, item2: Position) {
    return item1.x < item2.x + 40 &&
        item1.x + 40 > item2.x &&
        item1.y < item2.y + 40 &&
        item1.y + 40 > item2.y;
}

type Position = {
    x: number;
    y: number;
    id: string;
    image?: string;
    direction?: number;
    type?: string;
    time?: number;
};

export type GameState = {
  playerPosition: Position;
  asteroids: Position[];
  bullets: Position[];
  enemies: Position[];
  enemyBullets: Position[];
  gameOver: boolean;
  score: number;
};

export type GameAction =
  | { type: 'MOVE_PLAYER'; payload:{direction: string}  }
  | { type: 'ADD_ASTEROID' }
  | { type: 'ADD_BULLET' }
  | { type: 'ADD_ENEMY' }
  | { type: 'UPDATE_GAME_STATE' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_ENEMY_BULLET' };

  const initialState: GameState = {
    playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2, id: uuidv4() },
    asteroids: [],
    bullets: [],
    enemies: [],
    enemyBullets: [],
    gameOver: false,
    score: 0,
  };


  const asteroidImages = [asteroid1, asteroid2];

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {

        //ovládání hráče
        case 'MOVE_PLAYER': {
            const { direction } = action.payload;
            let newX = state.playerPosition.x;
            let newY = state.playerPosition.y;
            const step = 10; 

            if (direction === 'ArrowUp') newY = Math.max(newY - step, 0);
            if (direction === 'ArrowDown') newY = Math.min(newY + step, window.innerHeight - 50);
            if (direction === 'ArrowLeft') newX = Math.max(newX - step, 0);
            if (direction === 'ArrowRight') newX = Math.min(newX + step, window.innerWidth - 50);

            return { ...state, playerPosition: { ...state.playerPosition, x: newX, y: newY } };
          }
        case 'ADD_ASTEROID':
          const newAsteroid = {
            x: Math.random() * window.innerWidth,
            y: 0,
            id: uuidv4(),
            image: asteroidImages[Math.floor(Math.random() * asteroidImages.length)],
          };
          return { ...state, asteroids: [...state.asteroids, newAsteroid] };

        case 'ADD_BULLET':
          const newBullet = {
            x: state.playerPosition.x + 25, 
            y: state.playerPosition.y - 20,
            id: uuidv4(),
          };
          return { ...state, bullets: [...state.bullets, newBullet] };

        case 'ADD_ENEMY_BULLET':
            if (state.enemies.length > 0) {
                const newEnemyBullets = state.enemies.map(enemy => ({
                    x: enemy.x,
                    y: enemy.y,
                    id: uuidv4(),
                    type: enemy.type ?? 'enemy1',
                  }));
                return { ...state, enemyBullets: [...state.enemyBullets, ...newEnemyBullets] };
              }
              return state;

          case 'UPDATE_GAME_STATE': {
            
            let gameOver = state.gameOver;
           //pohyb asteroidů + detekce kolize
            const updatedAsteroids: Position[] = state.asteroids.map(asteroid => {
                if (detectCollision(asteroid, state.playerPosition)) {
                 
                  gameOver = true;
                }
              
                return { ...asteroid, y: asteroid.y + 10 };
              }).filter(asteroid => asteroid.y < window.innerHeight);
            
            
            
            //pohyb nepřátel + detekce kolize
            const updatedEnemies: Position[] = state.enemies.map(enemy => {
              
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
        
                    
        
                    
            
                return {
                  ...enemy,
                  x: newX,
                  y: newY,
                  time: newTime,
                };
              }})

              //pohyb střel hráče + detekce kolize
              let updatedBullets = state.bullets.map(bullet => ({
                ...bullet,
                y: bullet.y - 30, 
              })).filter(bullet => {
                
                if (bullet.y <= 0) {
                    return false;
                }

                for (let asteroid of state.asteroids) {
                    if (detectCollision(bullet, asteroid)) {
                        return false;
                    }
                }

                
                    const hitEnemyIndex = updatedEnemies.findIndex(enemy => detectCollision(bullet, enemy));
                    if (hitEnemyIndex !== -1) {
                    updatedEnemies.splice(hitEnemyIndex, 1); 
                    state.score += 1; 
                    return false; 
                    }
                
                
              
                return true;
              });; 
            
              
             //pohyb nepřátelských střel + detekce kolize
            const updatedEnemyBullets = state.enemyBullets.map(bullet => {
                const speed = bullet.type === 'enemy2' ? 60 : 30;
                const newY = bullet.y + speed;
        
                if (
                        detectCollision({ x: state.playerPosition.x, y: state.playerPosition.y, id: '' }, { x: bullet.x, y: newY, id: '' })
                ) {
                        gameOver = true;
                }
        
                return { ...bullet, y: newY };
            }).filter(bullet => bullet.y <= window.innerHeight);
            
              

              
              
              
          
            return {
                ...state,
                asteroids: updatedAsteroids,
                bullets: updatedBullets,
                enemyBullets: updatedEnemyBullets,
                enemies: updatedEnemies,
                gameOver: gameOver,
                
                
            };
          }
          
          
          
        case 'GAME_OVER':
          return { ...state, gameOver: true };
        case 'RESET_GAME':
          return initialState;
          case 'ADD_ENEMY':
            const newEnemy = {
              x: Math.random() * window.innerWidth,
              y: 0,
              id: uuidv4(),
              type: Math.random() < 0.5 ? 'enemy1' : 'enemy2', 
            };
            return { ...state, enemies: [...state.enemies, newEnemy] };
          default:
            return state;
        }
};

export default gameReducer;

import React from "react";

import { v4 as uuidv4 } from "uuid";
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";


//detekce kolize
const playerWidth = 50;
const playerHeight = 50;
const asteroidWidth = 50; 
const asteroidHeight = 50;
const bulletWidth = 5; 
const bulletHeight = 40;
const enemyWidth = 70;
const enemyHeight = 70;

function detectCollision(obj1: Position, obj2: Position, width1: number, height1: number, width2: number, height2: number) {
  return (
    obj1.x < obj2.x + width2 &&
    obj1.x + width1 > obj2.x &&
    obj1.y < obj2.y + height2 &&
    obj1.y + height1 > obj2.y
  );
}

type Position = {
    x: number;
    y: number;
    id: string;
    size?: number;
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
  lives: number;
  activeDirections: { [code: string]: boolean };
};

export type GameAction =
  
  | { type: 'ADD_ASTEROID' }
  | { type: 'ADD_BULLET' }
  | { type: 'ADD_ENEMY' }
  | { type: 'UPDATE_GAME_STATE' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_ENEMY_BULLET' }
  | { type: 'MOVE_PLAYER_UP' }
  | { type: 'MOVE_PLAYER_DOWN' }
  | { type: 'MOVE_PLAYER_LEFT' }
  | { type: 'MOVE_PLAYER_RIGHT' }
  | { type: 'STOP_MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' } };

  export const initialState: GameState = {
    playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2, id: uuidv4() },
    asteroids: [],
    bullets: [],
    enemies: [],
    enemyBullets: [],
    gameOver: false,
    score: 0,
    lives: 3,
    activeDirections: {},
  };

  const asteroidImages = [asteroid1, asteroid2];
  
const gameReducer = (state: GameState, action: GameAction): GameState => {
  
  //rychlost hráče
  const step = 20;
    switch (action.type) {

        //ovládání hráče
        case 'MOVE_PLAYER_UP':
            return {
              ...state,
              activeDirections: { ...state.activeDirections, up: true }
            };
          case 'MOVE_PLAYER_DOWN':
            return {
              ...state,
              activeDirections: { ...state.activeDirections, down: true }
            };
          case 'MOVE_PLAYER_LEFT':
            return {
              ...state,
              activeDirections: { ...state.activeDirections, left: true }
            };
          case 'MOVE_PLAYER_RIGHT':
            return {
              ...state,
              activeDirections: { ...state.activeDirections, right: true }
            };
          case 'STOP_MOVE_PLAYER':
            
            return {
              ...state,
              activeDirections: { ...state.activeDirections, [action.payload.direction]: false }
            };
      // vytvoření asteroidu
        case 'ADD_ASTEROID':
          const newAsteroid = {
            x: Math.random() * window.innerWidth,
            y: 0,
            id: uuidv4(),
            image: asteroidImages[Math.floor(Math.random() * asteroidImages.length)],
          };
          return { ...state, asteroids: [...state.asteroids, newAsteroid] };

      // vytvoření enemy
        case 'ADD_ENEMY':
            const direction = Math.random() < 0.5 ? 1 : -1;
            const newEnemy = {
              x: Math.random() * window.innerWidth,
              y: 0,
              id: uuidv4(),
              type: Math.random() < 0.5 ? 'enemy1' : 'enemy2', 
              direction: direction,
            };
            return { ...state, enemies: [...state.enemies, newEnemy] };

      // vytvoření střely
        case 'ADD_BULLET':
          const newBullet = {
            x: state.playerPosition.x + 25, 
            y: state.playerPosition.y - 20,
            id: uuidv4(),
          };
          return { ...state, bullets: [...state.bullets, newBullet] };

      // vytvoření nepřátelské střely
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
      
      //aktualizace stavu hry
          case 'UPDATE_GAME_STATE': {
            
            let gameOver = state.gameOver;
            let newLives = state.lives;

            //pohyb hráče
            const newPosition = { ...state.playerPosition };
              if (state.activeDirections.up) newPosition.y = Math.max(newPosition.y - step, 0);
              if (state.activeDirections.down) newPosition.y = Math.min(newPosition.y + step, window.innerHeight - 50);
              if (state.activeDirections.left) newPosition.x = Math.max(newPosition.x - step, 0);
              if (state.activeDirections.right) newPosition.x = Math.min(newPosition.x + step, window.innerWidth - 50);

             

           //pohyb asteroidů + detekce kolize
            const updatedAsteroids = state.asteroids.map(asteroid => {
              if (!gameOver && detectCollision(asteroid, state.playerPosition, asteroidWidth, asteroidHeight, playerWidth, playerHeight)) {
                newLives -= 1;
                return null; 
              }
              return { ...asteroid, y: asteroid.y + 10 };
            }).filter((asteroid): asteroid is Position => asteroid !== null && asteroid.y < window.innerHeight);
            
            
            
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
                    const speed = 30;
                    let newDirection = enemy.direction ?? 1;
                    let newX = enemy.x + (speed * newDirection);
                    const newY = enemy.y + 10;

                    
                    if (newX <= 0 || newX >= window.innerWidth - 40) {
                      newDirection *= -1; 
                      newX = enemy.x + (speed * newDirection); 
    }
                    
                    
                    
                
                    
            
                return {
                  ...enemy,
                  x: newX,
                  y: newY,
                  direction: newDirection,

                };
              }}).filter(enemy => enemy.y < window.innerHeight);

              //pohyb střel hráče + detekce kolize
              let updatedBullets = state.bullets.map(bullet => ({
                ...bullet,
                y: bullet.y - 100, 
              })).filter(bullet => {
                
                if (bullet.y <= 0) {
                    return false;
                }

                for (let asteroid of state.asteroids) {
                    if (detectCollision(bullet, asteroid, bulletWidth, bulletHeight, asteroidWidth, asteroidHeight)) {
                        return false;
                    }
                }

                
                    const hitEnemyIndex = updatedEnemies.findIndex(enemy => detectCollision(bullet, enemy, bulletWidth, bulletHeight, enemyWidth, enemyHeight));
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
                        detectCollision({ x: state.playerPosition.x, y: state.playerPosition.y, id: ''}, { x: bullet.x, y: newY, id: ''}, playerWidth, playerHeight, bulletWidth, bulletHeight)
                ) {
                    newLives -= 1;
                    return null;
                    
                }
        
                return { ...bullet, y: newY };
            }).filter((bullet) : bullet is Position => bullet !== null && bullet.y <= window.innerHeight);
            
            if (newLives <= 0 && !gameOver) {
              gameOver = true;
            }

              
              
              
          
            return {
                ...state,
                lives: newLives,
                asteroids: updatedAsteroids,
                bullets: updatedBullets,
                enemyBullets: updatedEnemyBullets,
                enemies: updatedEnemies,
                gameOver: gameOver,
                playerPosition: newPosition,
                
                
            };
          }
          
          
          
        case 'GAME_OVER':
          return { ...state, gameOver: true };
        case 'RESET_GAME':
          return initialState;
          
          default:
            return state;
        }
};

export default gameReducer;

import React from "react";

import { v4 as uuidv4 } from "uuid";
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";
import { Navigate } from "react-router-dom";



//detekce kolize
const playerWidth = 50;
const playerHeight = 50;
const asteroidWidth = 50; 
const asteroidHeight = 50;
const bulletWidth = 5; 
const bulletHeight = 40;
const enemyWidth = 100;
const enemyHeight = 100;
const bossWidth = 120;
const bossHeight = 120;


function detectCollision(obj1: Position, obj2: Position, width1: number, height1: number, width2: number, height2: number, offsetX: number = 0, offsetY: number = 0) {
  // lepší detekce pro enemy, které jsou posunuté
  const obj2AdjustedX = obj2.x + offsetX;
  const obj2AdjustedY = obj2.y + offsetY;

  // Vypočítáme hranice pro oba objekty
  const obj1Left = obj1.x;
  const obj1Right = obj1.x + width1;
  const obj1Top = obj1.y;
  const obj1Bottom = obj1.y + height1;

  const obj2Left = obj2AdjustedX;
  const obj2Right = obj2AdjustedX + width2;
  const obj2Top = obj2AdjustedY;
  const obj2Bottom = obj2AdjustedY + height2;

  // Kontrola, zda se hranice překrývají
  const collideX = obj1Right > obj2Left && obj1Left < obj2Right;
  const collideY = obj1Bottom > obj2Top && obj1Top < obj2Bottom;

  // Pokud se překrývají obě osy, došlo k kolizi
  return collideX && collideY;
}

type Upgrade = {
  name: string;
  price: number;
  owned?: boolean;

}

export const upgrades: Upgrade[] = [
  { name: 'Extra life', price: 10, owned: false},
  { name: 'Fire rate', price: 15, owned: false},
  {name: 'Invincibility', price: 20, owned: false},
  {name: 'Big Shot', price: 25, owned: false},
  

];
type Position = {
    x: number;
    y: number;
    id: string;
    size?: number;
    image?: string;
    direction?: number;
    type?: string;
    time?: number;
    isCharging?: boolean;
    originalY?: number;
    hasCollided?: boolean;
    directionX?: number;
    directionY?: number;
    lastShotTime?: number;
    
    
};

export type GameState = {
  playerPosition: Position;
  bossPosition: Position;
  asteroids: Position[];
  bullets: Position[];
  enemies: Position[];
  enemyBullets: Position[];
  megaBullets: Position[];
  gameOver: boolean;
  score: number;
  lives: number;
  bossLives: number;
  activeDirections: { [code: string]: boolean };
  bossPhase: number;

  //ability
  isInvincible: boolean;
  invincibilityCooldown: boolean;
  invincibilityTimeLeft: number;
  invincibilityCooldownTimeLeft: number;

  bigShotCooldown: boolean;
  
  bigShotCooldownTimeLeft: number,

  // pro budoucí rozšíření
  currentLevel: number;
  unlockedLevels: number[];
  upgrades: Upgrade[];
  currency: number;
};

export type GameAction =
  
  | { type: 'ADD_ASTEROID' }
  | { type: 'ADD_BULLET' }
  | { type: 'ADD_BOSS' }
  | { type: 'ADD_ENEMY' }
  | { type: 'UPDATE_GAMEPLAY_STATE' }
  | { type: 'UPDATE_BOSSFIGHT_STATE' }
  | { type: 'UPDATE_PLAYER_MOVEMENT' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_ENEMY_BULLET' }
  | { type: 'MOVE_BOSS' ; payload: { direction: string, movementSpeed: number } }
  | { type: 'MOVE_PLAYER_UP' }
  | { type: 'MOVE_PLAYER_DOWN' }
  | { type: 'MOVE_PLAYER_LEFT' }
  | { type: 'MOVE_PLAYER_RIGHT' }
  // Ability
  | { type: 'ACTIVATE_INVINCIBILITY'; payload: { duration: number; cooldown: number; } }
  | { type: 'RESET_INVINCIBILITY' }
  | {type: 'RESET_INVINCIBILITY_COOLDOWN'}
  | {type: 'DECREMENT_INVINCIBILITY_TIMER'; payload: { timeLeft: number; }}
  | {type: 'DECREMENT_COOLDOWN_TIMER'; payload: { timeLeft: number; }}
  | {type: 'ACTIVATE_BIG_SHOT' ; payload: { cooldown: number; }}
    | {type: 'RESET_BIG_SHOT_COOLDOWN'}
    | {type: 'DECREMENT_BIG_SHOT_COOLDOWN_TIMER'; payload: { timeLeft: number; }}
    | { type: 'ADD_MEGA_BULLET'; payload: { playerPosition: Position } }

  | { type: 'STOP_MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' } }
  | { type: 'PURCHASE_UPGRADE'; payload: { upgradeIndex: number; } };
 
  

  export const initialState: GameState = {
    playerPosition: { x: window.innerWidth /2, y: window.innerHeight / 2, id: uuidv4() },
    bossPosition: {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() },
    asteroids: [],
    bullets: [],
    enemies: [],
    enemyBullets: [],
    megaBullets: [],
    gameOver: false,
    score: 0,
    lives: 3,
    bossLives: 3,
    activeDirections: {},
    bossPhase: 1,

    //ability
    isInvincible: false,
    invincibilityCooldown: false,
    invincibilityTimeLeft: 10,
    invincibilityCooldownTimeLeft: 30,
    bigShotCooldown: false,
    
    bigShotCooldownTimeLeft: 30,

    // pro budoucí rozšíření
    currentLevel: 1,
    unlockedLevels: [1],
    upgrades: upgrades,
    currency: 50,
    

  };

  const asteroidImages = [asteroid1, asteroid2];
  
const gameReducer = (state: GameState, action: GameAction): GameState => {
  
  
  //rychlost hráče
  const step = 20;
  let gameOver = state.gameOver;
  let newLives = state.lives;
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
                    x: enemy.x + 45,
                    y: enemy.y,
                    id: uuidv4(),
                    type: enemy.type ?? 'enemy1',
                  }));
                return { ...state, enemyBullets: [...state.enemyBullets, ...newEnemyBullets] };
              }
              return state;

        // koupení upgradu + logika
        case 'PURCHASE_UPGRADE':

          const { upgradeIndex } = action.payload;
          const upgrade = state.upgrades[upgradeIndex];
          if (upgrade.owned) {
            
            return state;
          }
          const newUpgrades = state.upgrades.map((upgrade, index) => {
            if (index === upgradeIndex) {
              
              // Přidá jeden život
              if(upgrade.name === 'Extra life') {
                state.lives += 1; 
              }
              
              return { ...upgrade, owned: true }; // Nastaví `owned` na `true` pro zakoupený upgrade
            }
            return upgrade;
          });
        
          return {
            ...state,
            upgrades: newUpgrades,
            currency: state.currency - upgrade.price,
            // Zde předpokládáme, že cena upgrade byla již odečtena v případě, že hráč měl dostatek měny
          };
                  
          case 'ACTIVATE_INVINCIBILITY':
            if (!state.invincibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invincibility' && upgrade.owned)) {
              return {
                ...state,
                isInvincible: true,
                invincibilityCooldown: true,
                invincibilityTimeLeft: action.payload.duration, // 10 sekund
                invincibilityCooldownTimeLeft: action.payload.cooldown,
              };
            }
            return state;
          
          
          case 'RESET_INVINCIBILITY':
            return {
              ...state,
              isInvincible: false,
            };
          
          case 'RESET_INVINCIBILITY_COOLDOWN':
            return {
              ...state,
              invincibilityCooldown: false,
            };
            case 'DECREMENT_INVINCIBILITY_TIMER':
              console.log('DECREMENT_INVINCIBILITY_TIMER payload:', action.payload);
              return {
                ...state,
                invincibilityTimeLeft: action.payload.timeLeft,
              };
            
            case 'DECREMENT_COOLDOWN_TIMER':
              return {
                ...state,
                invincibilityCooldownTimeLeft: action.payload.timeLeft,
              };
              case 'ACTIVATE_BIG_SHOT':
                
                  console.log('ACTIVATE_BIG_SHOT payload:', action.payload)
    return {
      ...state,
     bigShotCooldown: true,
      bigShotCooldownTimeLeft: action.payload.cooldown, 
    
  }
  

  case 'DECREMENT_BIG_SHOT_COOLDOWN_TIMER':
    console.log('DECREMENT_BIG_SHOT_COOLDOWN_TIMER payload:', action.payload);
    
      return {
        ...state,
        
        bigShotCooldownTimeLeft: action.payload.timeLeft,
      };
    
    
          
          case 'RESET_BIG_SHOT_COOLDOWN':
            return {
              ...state,
              bigShotCooldown: false,
             
            };
         
            case 'ADD_MEGA_BULLET':
  const newMegaBullet = {
    x: state.playerPosition.x + 25, // Nastavte správnou pozici x
    y: state.playerPosition.y - 20, // Nastavte správnou pozici y
    id: uuidv4(),
    
  };
  return { ...state, megaBullets: [...state.megaBullets, newMegaBullet] };
      
  
      //aktualizace stavu hry
          case 'UPDATE_GAMEPLAY_STATE': {
            
            

            

             

           //pohyb asteroidů + detekce kolize
            const updatedAsteroids = state.asteroids.map(asteroid => {
              if (!state.isInvincible && detectCollision(asteroid, state.playerPosition, asteroidWidth, asteroidHeight, playerWidth, playerHeight)) {
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
                    const speed = 20;
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
                    state.currency += 10;
                    return false; 
                    }
                
                
              
                return true;
              });; 

            // Big Shot
            let updatedMegaBullets = state.megaBullets.map(megaBullet => ({
              ...megaBullet,
              y: megaBullet.y - 100,
            })).filter(megaBullet => {
              if (megaBullet.y <= 0) {
                return false;
              }
              for (let asteroid of state.asteroids) {
                if (detectCollision(megaBullet, asteroid, bulletWidth, bulletHeight, asteroidWidth, asteroidHeight)) {
                  return false;
                }

              }
              const hitEnemyIndex = updatedEnemies.findIndex(enemy => detectCollision(megaBullet, enemy, bulletWidth, bulletHeight, enemyWidth, enemyHeight));
              if (hitEnemyIndex !== -1) {
                updatedEnemies.splice(hitEnemyIndex, 1); 
                state.score += 1; 
                state.currency += 10;
                return false; 
              }
              return true;
            });
            
              
             //pohyb nepřátelských střel + detekce kolize
            const updatedEnemyBullets = state.enemyBullets.map(bullet => {
                const speed = bullet.type === 'enemy2' ? 60 : 30;
                const newY = bullet.y + speed;
        
                if (
                  !state.isInvincible && detectCollision({ x: state.playerPosition.x, y: state.playerPosition.y, id: ''}, { x: bullet.x, y: newY, id: ''}, playerWidth, playerHeight, bulletWidth, bulletHeight)
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
                megaBullets: updatedMegaBullets,
                
                
                
                
            };
          }


        //aktualizace stavu boss fightu
        case 'UPDATE_BOSSFIGHT_STATE': {
          let newBossLives = state.bossLives;
          
          // Boss fáze 1
          if(state.bossPhase === 1) {

            
            // Pohyb bosse + útok
            if (state.bossPosition ) {
              let { x, y, direction, isCharging, originalY, hasCollided } = state.bossPosition;
              

              // Zpracování "výpadu" dolů
              if (isCharging) {
                y += 70; // rychlost výpadu
                if (y >= window.innerHeight + 20) { // Dosáhnutí spodní části obrazovky
                  y = originalY ?? 0; 
                  isCharging = false;
                  ;
                }
                if (!state.isInvincible && !hasCollided && detectCollision(state.playerPosition, state.bossPosition, playerWidth, playerHeight, bossWidth, bossHeight,-50, -120)) {
                  newLives -= 1;
                  hasCollided = true;
                }
                
              } else {
                
                if (Math.abs(x - state.playerPosition.x) < 30) {//pokud pozice hráče = pozici bosse, tak boss začne útočit
                  isCharging = true;
                  originalY = y; 
                  hasCollided = false;
                }
                
                if (!isCharging) {
                  
                  x += ((direction as number) || 1) * 70; // rychlost pohybu do stran
                  console.log(direction)
                  
                  if (x <= 0) {
                    x = 0; 
                    direction = 1; 
                  } else if (x >= window.innerWidth - 100) {
                    x = window.innerWidth - 100; 
                    direction = -1; 
                  }
                }
                
            }
            if(state.bossLives <= 0) {
              state.bossPhase = 2;
              isCharging = false;
              newBossLives = 3;
              state.bossPosition = {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() };
            }
        
            
            
            
            state.bossPosition = { ...state.bossPosition, x, y, direction, isCharging, originalY, hasCollided};
}



          }
          // Boss fáze 2
          else if(state.bossPhase === 2) {
            let { x, y, direction, isCharging } = state.bossPosition;

           isCharging = false;
            
            if (Math.abs(state.bossPosition.x - state.playerPosition.x) < 40) {


              // Boss začne střílet
          
              
              
              const speedX = (state.playerPosition.x - state.bossPosition.x) / 100;
              const speedY = (state.playerPosition.y - state.bossPosition.y) / 100;
                
              [0, 1, 2].forEach(() => {
                state.enemyBullets.push({
                  x: state.bossPosition.x + bossWidth / 2,
                  y: state.bossPosition.y + bossHeight / 2,
                  id: uuidv4(),
                  directionX: speedX,
                  directionY: speedY,
                });
              });
              if(state.bossLives <= 0) {
                state.bossPhase = 3;
                
                newBossLives = 10;
                state.bossPosition = {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() };
              }
          
              
              state.bossPosition = { ...state.bossPosition, x, y, direction, isCharging};


          }}

          // Boss fáze 3
          else if (state.bossPhase === 3) {
            
            
            if (state.enemies.filter(e => e.type === 'enemy3').length < 4) {
              for (let i = 0; i < 3; i++) {
                state.enemies.push({
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * (window.innerHeight / 4), // Startují z horní čtvrtiny obrazovky
                  id: uuidv4(),
                  type: 'enemy3',
                  directionX: Math.random() < 0.5 ? 1 : -1, 
                  directionY: Math.random() < 0.5 ? 1 : -1, 
                  lastShotTime: 0,
                });
              }
            }
            const currentTime = Date.now();

            // Logika pro 'Enemy3' střelbu
            state.enemies = state.enemies.map(enemy => {
              if (enemy.type === 'enemy3') {
                
                const movementSpeed = 7; 
            
                
                const directionX = (state.playerPosition.x > enemy.x ? 1 : -1) * Math.random();
                const directionY = (state.playerPosition.y > enemy.y ? 1 : -1) * Math.random();
            
                // Omezení střelby
                if (!enemy.lastShotTime || currentTime - enemy.lastShotTime > 3000) {
                  
                  const angle = Math.atan2(state.playerPosition.y - enemy.y, state.playerPosition.x - enemy.x);
                  const bulletSpeed = 5;
                  state.enemyBullets.push({
                    x: enemy.x,
                    y: enemy.y,
                    id: uuidv4(),
                    directionX: Math.cos(angle) * bulletSpeed,
                    directionY: Math.sin(angle) * bulletSpeed,
                    type: 'enemy3',
                  });
            
                  enemy.lastShotTime = currentTime; 
                }
                
                // Aktualizace pozice nepřítele
                return {
                  ...enemy,
                  x: enemy.x + directionX * movementSpeed,
                  y: enemy.y + directionY * movementSpeed,
                };
              } else {
                return enemy; 
              }
            });
          
          }
          
          

            //pohyb střel hráče + detekce kolize
            let updatedBullets = state.bullets.map(bullet => ({
              ...bullet,
              y: bullet.y - 100, 
            })).filter(bullet => {
              
              if (detectCollision(bullet, state.bossPosition, bulletWidth, bulletHeight, bossWidth, bossHeight, 0, 0)) {
                newBossLives -= 1;
                return null;
              }
              

              if (bullet.y <= 0) {
                  return false;
              }
              // Detekce kolize s enemy3 ve třetí fázi boss fightu
              const hitEnemyIndex1 = state.enemies.findIndex(enemy =>
                  enemy.type === 'enemy3' &&
                  detectCollision(bullet, enemy, bulletWidth, bulletHeight, enemyWidth, enemyHeight)
                );

                if (hitEnemyIndex1 !== -1) {
                  state.enemies.splice(hitEnemyIndex1, 1); // Odstranění enemy3 po zásahu
                  state.score += 1; 
                  return false; 
                }


              return true;
            });; 
            if (newLives <= 0 && !gameOver) {
              gameOver = true;
            }
            let updatedMegaBullets = state.megaBullets.map(megaBullet => ({
              ...megaBullet,
              y: megaBullet.y - 100,
            })).filter(megaBullet => {
              if (megaBullet.y <= 0) {
                return false;
              }
              if (detectCollision(megaBullet, state.bossPosition, bulletWidth, bulletHeight, bossWidth, bossHeight, 0, 0)) {
                newBossLives -= 3;
                return null;
              }
              return true;
            });

            //pohyb nepřátel + detekce kolize
            const updatedEnemies = state.enemies.map((enemy) => {
              if (enemy.type === 'enemy3') {
                
                const directionX = state.playerPosition.x > enemy.x ? 1 : -1;
                const directionY = state.playerPosition.y > enemy.y ? 1 : -1;
                
                
                return {
                  ...enemy,
                  
                  x: enemy.x + directionX * (Math.random() * 5),
                  y: enemy.y + directionY * (Math.random() * 5),
                };
              } else {
                
                return enemy;
              }
            });
            
            //pohyb nepřátelských střel + detekce kolize
            const updatedEnemyBullets = state.enemyBullets.map(bullet => {
              const speed = bullet.type === 'enemy2' ? 60 : 30;
              const newY = bullet.y + speed;
      
              if (
                !state.isInvincible && detectCollision({ x: state.playerPosition.x, y: state.playerPosition.y, id: ''}, { x: bullet.x, y: newY, id: ''}, playerWidth, playerHeight, bulletWidth, bulletHeight)
              ) {
                  newLives -= 1;
                  return null;
                  
              }
      
              return { ...bullet, y: newY };
          }).filter((bullet) : bullet is Position => bullet !== null && bullet.y <= window.innerHeight);


                return{...state, bossPosition: state.bossPosition,enemyBullets:updatedEnemyBullets, bullets: updatedBullets, megaBullets: updatedMegaBullets, gameOver: gameOver, lives: newLives, bossLives: newBossLives, enemies: updatedEnemies, bossPhase: state.bossPhase};
        }
      

        case 'UPDATE_PLAYER_MOVEMENT': {
            //pohyb hráče
            const newPosition = { ...state.playerPosition };
              if (state.activeDirections.up) newPosition.y = Math.max(newPosition.y - step, 0);
              if (state.activeDirections.down) newPosition.y = Math.min(newPosition.y + step, window.innerHeight - 50);
              if (state.activeDirections.left) newPosition.x = Math.max(newPosition.x - step, 0);
              if (state.activeDirections.right) newPosition.x = Math.min(newPosition.x + step, window.innerWidth - 50);
              return { ...state, playerPosition: newPosition };
        }
        case 'MOVE_BOSS': {
            if(state.bossPhase === 2 || state.bossPhase === 3) {
            
            const { direction, movementSpeed } = action.payload;
            let { x, y } = state.bossPosition;
        
            switch (direction) {
              case 'up': y -= movementSpeed; break;
              case 'down': y += movementSpeed; break;
              case 'left': x -= movementSpeed; break;
              case 'right': x += movementSpeed; break;
            }
        
            // Horizontální pohyb směrem k hráči
              if (state.playerPosition.x > x) {
                x += movementSpeed; 
              } else if (state.playerPosition.x < x) {
                x -= movementSpeed; 
              }

              // Vertikální pohyb s omezením, aby zůstal nad polovinou obrazovky
              const screenHeight = window.innerHeight;
              if (y > screenHeight / 2) {
                y -= movementSpeed; 
              } 

              x = Math.max(0, Math.min(window.innerWidth - bossWidth, x));
              y = Math.max(0, Math.min(screenHeight / 2, y)); 

              return {
                ...state,
                bossPosition: { ...state.bossPosition, x, y, isCharging: false }
              };
            }
            return state;
        }
        case 'GAME_OVER':
          
          return { ...state, gameOver: true };
        
        case 'RESET_GAME':
          const initialStateWithUpgrades = {
            ...initialState,
            currency: state.currency,
            upgrades: state.upgrades,
            lives: initialState.lives,

          };
        
          // Kontrola, zda hráč vlastní upgrade "Extra life"
          const extraLifeUpgradeOwned = initialStateWithUpgrades.upgrades.some(upgrade => upgrade.name === 'Extra life' && upgrade.owned);
          if (extraLifeUpgradeOwned) {
            initialStateWithUpgrades.lives += 1; 
          }
          
          return initialStateWithUpgrades;
        
          
          default:
            return state;
        }
};

export default gameReducer;

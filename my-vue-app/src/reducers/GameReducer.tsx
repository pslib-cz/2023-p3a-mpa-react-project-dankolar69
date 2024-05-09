

import { v4 as uuidv4 } from "uuid";
import asteroid1 from "../assets/images/asteroid1.png";
import asteroid2 from "../assets/images/asteroid2.png";
import { stat } from "fs";




//detekce kolize, škálování kvůli responzivitě
const isMobile = window.innerWidth <= 768; 
const baseWidth = isMobile ? 375 : 1920;
const scaleFactor = window.innerWidth / baseWidth;

const playerWidth = 50 * scaleFactor;
const playerHeight = 50 * scaleFactor;
const asteroidWidth = 50 * scaleFactor;
const asteroidHeight = 50 * scaleFactor;
const bulletWidth = 5 * scaleFactor;
const bulletHeight = 40 * scaleFactor;
const enemyWidth = 100 * scaleFactor;
const enemyHeight = 100 * scaleFactor;
const bossWidth = 120 * scaleFactor;
const bossHeight = 120 * scaleFactor;


export function detectCollision(obj1: Position, obj2: Position, width1: number, height1: number, width2: number, height2: number, offsetX: number = 0, offsetY: number = 0) {
  // lepší detekce pro enemy, které jsou posunuté
  const obj1FutureLeft = obj1.x - offsetY;
  const obj1FutureRight = obj1.x + width1 + offsetX;
  const obj1Top = obj1.y;
  const obj1Bottom = obj1.y + height1;

  const obj2FutureLeft = obj2.x;
  const obj2FutureRight = obj2.x + width2;
  const obj2Top = obj2.y;
  const obj2Bottom = obj2.y + height2;

  const collideX = (obj1FutureRight > obj2FutureLeft && obj1FutureLeft < obj2FutureRight);
  const collideY = (obj1Bottom > obj2Top && obj1Top < obj2Bottom);

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
  {name: 'Big Shot', price: 25, owned: false},
  {name: 'Invisibility', price: 30, owned: false},
  

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
    Bulletsdirection?: 'down' | 'diagonalLeft' | 'diagonalRight'|string;

    //boss2
    isTeleporting?: boolean;
    
    
    
    
};

export type GameState = {
  playerPosition: Position;
  bossPosition: Position;
  boss2Position: Position;
  blackHoles: Position[];
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
  boss2Phase: number;
  boss2lives: number;
  playerShrinking: boolean;
  boss2TimerSet: boolean;
  

  //ability
  isInvincible: boolean;
  invisibilityCooldown: boolean;
  invisibilityTimeLeft: number;
  invisibilityCooldownTimeLeft: number;
  bigShotCooldown: boolean;
  bigShotCooldownTimeLeft: number,

  upgrades: Upgrade[];
  currency: number;
};

export type GameAction =
  
  | { type: 'ADD_ASTEROID' }
  | { type: 'ADD_BULLET' }
  | { type: 'ADD_BOSS' }
  | { type: 'ADD_ENEMY' }
  | {type: 'ADD_BLACKHOLE'}
  | { type: 'UPDATE_GAMEPLAY_STATE' }
  | { type: 'UPDATE_BOSSFIGHT_STATE' }
  | { type: 'UPDATE_BOSSFIGHT_STATE2' }
  | { type: 'UPDATE_PLAYER_MOVEMENT', payload?: { moveRight: boolean; moveLeft: boolean; moveUp: boolean; moveDown: boolean; } }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_ENEMY_BULLET' }
  | { type: 'ADD_MEGA_BULLET'; payload: { playerPosition: Position } }
  | { type: 'MOVE_BOSS' ; payload: { direction: string, movementSpeed: number } }
  | { type: 'MOVE_PLAYER_UP' }
  | { type: 'MOVE_PLAYER_DOWN' }
  | { type: 'MOVE_PLAYER_LEFT' }
  | { type: 'MOVE_PLAYER_RIGHT' }
  | { type: 'STOP_MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' | 'all' } }
  | { type: 'PREPARE_FOR_CONTINUED_GAMEPLAY' }
  | { type: 'TRIGGER_BLACK_HOLE_EFFECT' }
  // Ability
  | { type: 'ACTIVATE_INVISIBILITY'; payload: { duration: number; cooldown: number; } }
  | { type: 'RESET_INVISIBILITY' }
  | {type: 'RESET_INVISIBILITY_COOLDOWN'}
  | {type: 'DECREMENT_INVISIBILITY_TIMER'; payload: { timeLeft: number; }}
  | {type: 'DECREMENT_COOLDOWN_TIMER'; payload: { timeLeft: number; }}
  | {type: 'ACTIVATE_BIG_SHOT' ; payload: { cooldown: number; }}
    | {type: 'RESET_BIG_SHOT_COOLDOWN'}
    | {type: 'DECREMENT_BIG_SHOT_COOLDOWN_TIMER'; payload: { timeLeft: number; }}
    | { type: 'PURCHASE_UPGRADE'; payload: { upgradeIndex: number; } };
 
  

  export const initialState: GameState = {
    playerPosition: { x: window.innerWidth /2, y: window.innerHeight / 2, id: uuidv4() },
    bossPosition: {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() },
    boss2Position: {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() },
    blackHoles: [],
    asteroids: [],
    bullets: [],
    enemies: [],
    enemyBullets: [],
    megaBullets: [],
    gameOver: false,
    score: 0,
    lives: 3,
    bossLives: 10,
    boss2Phase: 1,
    boss2lives: 10,
    activeDirections: {},
    bossPhase: 1,
    playerShrinking: false,
    boss2TimerSet: false,
    

    //ability
    isInvincible: false,
    invisibilityCooldown: false,
    invisibilityTimeLeft: 10,
    invisibilityCooldownTimeLeft: 30,
    bigShotCooldown: false,
    bigShotCooldownTimeLeft: 30,

    upgrades: JSON.parse(localStorage.getItem('upgrades') || JSON.stringify(upgrades)),
    currency: JSON.parse(localStorage.getItem('currency') as string) || 0
    

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
            if (action.payload.direction === 'all') {
              return {
                ...state,
                activeDirections: { up: false, down: false, left: false, right: false }
              };
            } else {
            return {
              ...state,
              activeDirections: { ...state.activeDirections, [action.payload.direction]: false }
            };
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
        // přidání černé díry
        case 'ADD_BLACKHOLE':
                const newBlackHole = {
                    x: Math.random() * window.innerWidth, 
                    y: 0, 
                    id: uuidv4(),
                    size: 60, 
                };
                return {
                    ...state,
                    blackHoles: [...state.blackHoles, newBlackHole]
                };
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
            
          };
           
          // aktivace neviditelnosti
          case 'ACTIVATE_INVISIBILITY':
            if (!state.invisibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invisibility' && upgrade.owned)) {
              return {
                ...state,
                isInvincible: true,
                invisibilityCooldown: true,
                invisibilityTimeLeft: action.payload.duration, 
                invisibilityCooldownTimeLeft: action.payload.cooldown,
              };
            }
            return state;
          
          //resetování neviditelnosti
          case 'RESET_INVISIBILITY':
            return {
              ...state,
              isInvincible: false,
            };
          
          //resetování cooldownu neviditelnosti
          case 'RESET_INVISIBILITY_COOLDOWN':
            return {
              ...state,
              invisibilityCooldown: false,
            };
          //odčítání času neviditelnosti
            case 'DECREMENT_INVISIBILITY_TIMER':
              console.log('DECREMENT_INVISIBILITY_TIMER payload:', action.payload);
              return {
                ...state,
                invisibilityTimeLeft: action.payload.timeLeft,
              };
            //odčítání času cooldownu neviditelnosti
            case 'DECREMENT_COOLDOWN_TIMER':
              return {
                ...state,
                invisibilityCooldownTimeLeft: action.payload.timeLeft,
              };

              //aktivace Big Shot
              case 'ACTIVATE_BIG_SHOT':
                
                  console.log('ACTIVATE_BIG_SHOT payload:', action.payload)
                  return {
                    ...state,
                  bigShotCooldown: true,
                    bigShotCooldownTimeLeft: action.payload.cooldown, 
    
                 }
  
                //odčítání času cooldownu Big Shot
              case 'DECREMENT_BIG_SHOT_COOLDOWN_TIMER':
                console.log('DECREMENT_BIG_SHOT_COOLDOWN_TIMER payload:', action.payload);
                
                  return {
                    ...state,
                    
                    bigShotCooldownTimeLeft: action.payload.timeLeft,
                  };
    
    
          //resetování cooldownu Big Shot
                  case 'RESET_BIG_SHOT_COOLDOWN':
                    return {
                      ...state,
                      bigShotCooldown: false,
                    
                    };
                    
            //přidání mega střely = Big Shot
            case 'ADD_MEGA_BULLET':
              const newMegaBullet = {
                x: state.playerPosition.x + 25, // Nastavte správnou pozici x
                y: state.playerPosition.y - 20, // Nastavte správnou pozici y
                id: uuidv4(),
    
                };
                return { ...state, megaBullets: [...state.megaBullets, newMegaBullet] };
      
  
          //aktualizace hlavního stavu hry
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

                
                    const hitEnemyIndex = updatedEnemies.findIndex(enemy => detectCollision(bullet, enemy, bulletWidth, bulletHeight, enemyWidth, enemyHeight, 50, 30));
                    if (hitEnemyIndex !== -1) {
                    updatedEnemies.splice(hitEnemyIndex, 1); 
                    state.score += 1; 
                    state.currency += 1;
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
                state.currency += 1;
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
            

            const updatedBlackHoles = state.blackHoles.map(blackHole => {
              
              return { ...blackHole, y: blackHole.y + 10 }; // Move black hole down

          }).filter((blackHole): blackHole is Position => blackHole !== null && blackHole.y < window.innerHeight);
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
                blackHoles: updatedBlackHoles,
                
                
                
                
            };
          }


        //aktualizace stavu boss fightu 1
        case 'UPDATE_BOSSFIGHT_STATE': {
          let newBossLives = state.bossLives;
          
          // Boss fáze 1
          if(state.bossPhase === 1) {

            
            // Pohyb bosse + útok
            if (state.bossPosition ) {
              let { x, y, direction, isCharging, originalY, hasCollided } = state.bossPosition;
              console.log("Invisibility", state.isInvincible);

              // Zpracování "výpadu" dolů
              if (isCharging) {

                // rychlost výpadu
                if(isMobile) {
                  y += 30;
                }else {
                  y += 50;
                }
                if (y >= window.innerHeight + 20) { // Dosáhnutí spodní části obrazovky
                  y = originalY ?? 0; 
                  isCharging = false;
                  ;
                }
                if (!state.isInvincible && !hasCollided && detectCollision(state.playerPosition, state.bossPosition, playerWidth, playerHeight, bossWidth, bossHeight, 20, -50)) {
                  newLives -= 1;
                  console.log('Player hit by boss');
                  
                  hasCollided = true;
                }
                
              } else {
                
                if (Math.abs(x - state.playerPosition.x) < 30) {//pokud pozice hráče = pozici bosse, tak boss začne útočit
                  isCharging = true;
                  originalY = y; 
                  hasCollided = false;
                }
                
                if (!isCharging) {
                  
                  if(isMobile) {
                    x += ((direction as number) || 1) * 30; // rychlost pohybu do stran
                  } else {
                  x += ((direction as number) || 1) * 70; // rychlost pohybu do stran
                  console.log(direction)}
                  
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
              state.score+3;
              newBossLives = 10;
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
                state.score+3;
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
                  y: Math.random() * (window.innerHeight / 4), // Start in the top quarter of the screen
                  id: uuidv4(),
                  type: 'enemy3',
                  directionX: Math.random() < 0.5 ? 1 : -1, 
                  directionY: Math.random() < 0.5 ? 1 : -1,
                  lastShotTime: 0,
                });
              }
            }
            const currentTime = Date.now();
          
         
            state.enemies = state.enemies.map(enemy => {
              if (enemy.type === 'enemy3') {
                const movementSpeed = 7;
                const steps = 10; 
                let newX = enemy.x;
                let newY = enemy.y;
          
                for (let i = 0; i < steps; i++) {
                  newX += (enemy.directionX??0 * movementSpeed) / steps;
                  newY += (enemy.directionY??0 * movementSpeed) / steps;
          
                 
                  if (detectCollision({x: newX, y: newY, id: enemy.id}, state.playerPosition, enemyWidth, enemyHeight, playerWidth, playerHeight)) {
                    
                    console.log('Collision detected with player');
                    
                    break;
                  }
                }
          
                enemy.x = newX; 
                enemy.y = newY;
          
                // Shooting logic
                if (!enemy.lastShotTime || currentTime - enemy.lastShotTime > 3000) {
                  const angle = Math.atan2(state.playerPosition.y - enemy.y, state.playerPosition.x - enemy.x);
                  const bulletSpeed = 5;
                  state.enemyBullets.push({
                    x: enemy.x + 50,
                    y: enemy.y,
                    id: uuidv4(),
                    directionX: Math.cos(angle) * bulletSpeed,
                    directionY: Math.sin(angle) * bulletSpeed,
                    type: 'enemy3',
                  });
          
                  enemy.lastShotTime = currentTime; // Update the last shot time
                }
              } else {
                return enemy; // Return non-enemy3 types unchanged
              }
              return enemy; // Return the potentially updated enemy3
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

            // Big Shot
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
        
        //aktualizace stavu boss fightu2
        case 'UPDATE_BOSSFIGHT_STATE2':
          let newBossLives = state.boss2lives;
          

          // Boss2 fáze 1
        if (state.boss2Phase === 1 && !state.boss2Position.isTeleporting && Math.random() < 0.1) {
            // Boss teleports
            state.boss2Position.x = Math.random() * (window.innerWidth - bossWidth);
            state.boss2Position.y = Math.random() * (window.innerHeight - bossHeight);
            state.boss2Position.isTeleporting = true;
            setTimeout(() => {
                state.boss2Position.isTeleporting = false;
            }, 2000);  

            if(state.boss2lives <= 0) {
              state.boss2Phase = 2;
             
              newBossLives = 10;
              state.boss2Position = {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() };
            }
        }

        // Boss2 fáze 2
        else if (state.boss2Phase === 2) {

          let { hasCollided } = state.boss2Position;
          
          //Boss2 se snaží hráče zasáhnout
          
          let moveSpeed;
          if (isMobile) {
            moveSpeed = 7;
          } else {
            moveSpeed = 15;
          }

          const deltaX = state.playerPosition.x - state.boss2Position.x;
          const deltaY = state.playerPosition.y - state.boss2Position.y;

          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const moveX = (deltaX / distance) * moveSpeed;
          const moveY = (deltaY / distance) * moveSpeed;
      
          
          state.boss2Position.x += moveX;
          state.boss2Position.y += moveY;
      
         
          if (!state.isInvincible && !hasCollided && detectCollision(state.boss2Position, state.playerPosition, bossWidth, bossHeight, playerWidth, playerHeight, 0, -10)) {
            state.boss2Position.hasCollided = true;  
            newLives -= 1;
            console.log("Player hit! Lives left: ", newLives);
    
            if (newLives <= 0) {
                console.log("Player is dead. Stop the boss.");
               
            }
    
          
            state.boss2Position.x -= moveX * 2.5; 
            state.boss2Position.y -= moveY * 2.5;
    
           
               
            
        } else if (state.boss2Position.hasCollided) {

            // když se hráč snaží utéct boss resetuje po úspěšném útoku pozici
            if (distance > 50) { 
              state.boss2Position = {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() };
                state.boss2Position.hasCollided = false;
            }
        }
        if(state.boss2lives <= 0 && state.boss2Phase === 2) {
          state.boss2Phase = 3;
          
          newBossLives = 10;
          state.boss2Position = {x: window.innerWidth / 2, y: window.innerHeight/3, id: uuidv4() };
        }
        state.boss2Position = { ...state.boss2Position, hasCollided};
          
        }
    
        
          
      
    

    

        // Boss2 fáze 3
        else if (state.boss2Phase === 3 ) {
          //Boss střílí střely do všech směrů

          //pokud je hráč v dosahu bossa, boss začne střílet
          const xDifference = Math.abs(state.boss2Position.x - state.playerPosition.x);
          const range = 30;

          if(xDifference <= range ) {

          const bossBullets = [
            { id: uuidv4(), x: state.boss2Position.x + 30, y: state.boss2Position.y + 10, type: 'enemy', Bulletsdirection: 'down' },
            { id: uuidv4(), x: state.boss2Position.x + 30, y: state.boss2Position.y + 10, type: 'enemy', Bulletsdirection: 'diagonalLeft' },
            { id: uuidv4(), x: state.boss2Position.x + 30, y: state.boss2Position.y + 10, type: 'enemy', Bulletsdirection: 'diagonalRight' }
        ];

        // Přidání střel do pole nepřátelských střel
        state.enemyBullets.push(...bossBullets);
        }}

        
        //pohyb střel hráče + detekce kolize
        let updatedBullets = state.bullets.map(bullet => ({
          ...bullet,
          y: bullet.y - 100, 
        })).filter(bullet => {
          
          if (detectCollision(bullet, state.boss2Position, bulletWidth, bulletHeight, bossWidth, bossHeight, 0, 0)) {
            newBossLives -= 1;
            return null;
          }
          

          if (bullet.y <= 0) {
              return false;
          }
          
          return true;
        });; 
        if (newLives <= 0 && !gameOver) {
          gameOver = true;
        }

        // Big Shot
        let updatedMegaBullets = state.megaBullets.map(megaBullet => ({
          ...megaBullet,  
          y: megaBullet.y - 100,
        })).filter(megaBullet => {
          if (megaBullet.y <= 0) {
            return false;
          }
          if (detectCollision(megaBullet, state.boss2Position, bulletWidth, bulletHeight, bossWidth, bossHeight, 0, 0)) {
            newBossLives -= 3;
            return null;
          }
          return true;
        });

        
        
        //pohyb nepřátelských střel + detekce kolize
        const updatedEnemyBullets = state.enemyBullets.map(bullet => {
          const speed = bullet.type === 'enemy2' ? 60 : 30;
          let newY = bullet.y + speed;
          
          switch (bullet.Bulletsdirection) {
            case 'down':
              newY += 30;  // Speed of the bullet going down
              break;
            case 'diagonalLeft':
              newY += 30;
              bullet.x -= 15;  // Speed of the bullet going diagonally left
              break;
            case 'diagonalRight':
              newY += 30;
              bullet.x += 15;  // Speed of the bullet going diagonally right
              break;
            default:
              newY += 30;  // Default movement downward
          }
          if (
            !state.isInvincible && detectCollision({ x: state.playerPosition.x, y: state.playerPosition.y, id: ''}, { x: bullet.x, y: newY, id: ''}, playerWidth, playerHeight, bulletWidth, bulletHeight)
          ) {
              newLives -= 1;
              return null;
              
          }
          return { ...bullet, y: newY };
      }).filter((bullet) : bullet is Position => bullet !== null && bullet.y <= window.innerHeight);
        
       


            return{...state, boss2Position: state.boss2Position,enemyBullets:updatedEnemyBullets, bullets: updatedBullets, megaBullets: updatedMegaBullets, gameOver: gameOver, lives: newLives, boss2lives: newBossLives, boss2Phase: state.boss2Phase};
    
        
        case 'UPDATE_PLAYER_MOVEMENT': {
            //pohyb hráče
            if (action.payload) {
              const { moveRight, moveLeft, moveUp, moveDown } = action.payload;
              return {
                ...state,
                activeDirections: {
                  right: moveRight,
                  left: moveLeft,
                  up: moveUp,
                  down: moveDown
                }
              };
            } else {
              const newPosition = { ...state.playerPosition };
              if (state.activeDirections.up) newPosition.y = Math.max(newPosition.y - step, 0);
              if (state.activeDirections.down) newPosition.y = Math.min(newPosition.y + step, window.innerHeight - 50);
              if (state.activeDirections.left) newPosition.x = Math.max(newPosition.x - step, 0);
              if (state.activeDirections.right) newPosition.x = Math.min(newPosition.x + step, window.innerWidth - 50);
              return { ...state, playerPosition: newPosition };
            };
            
        }
        case 'MOVE_BOSS': {
            if(state.bossPhase === 2 || state.bossPhase === 3) {
            
            const { direction, movementSpeed } = action.payload;
            let { x, y } = state.bossPosition
        
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
                bossPosition: { ...state.bossPosition, x, y, isCharging: false },
                
              };
            }
            else if (state.boss2Phase === 3) {
              const { direction, movementSpeed } = action.payload;
              let { x, y } = state.boss2Position; // Correctly reference boss2Position
          
              switch (direction) {
                case 'up': y -= movementSpeed; break;
                case 'down': y += movementSpeed; break;
                case 'left': x -= movementSpeed; break;
                case 'right': x += movementSpeed; break;
              }
          
              

              const screenHeight = window.innerHeight;
              if (y > screenHeight / 2) {
                y -= movementSpeed; 
              } 
              x = Math.max(0, Math.min(window.innerWidth - bossWidth, x));
              y = Math.max(0, Math.min(screenHeight / 2, y)); 
          
              return {
                ...state,
                boss2Position: { ...state.boss2Position, x, y } // Only update boss2Position
              };
            }
            return state;
      
        }
        case 'TRIGGER_BLACK_HOLE_EFFECT':
            return {
                ...state,
                playerShrinking: true,  
                 
            };
        case 'GAME_OVER':
          
          return { ...state, gameOver: true };
        
          //logika pro pokračování ve hře po bossovi
          case 'PREPARE_FOR_CONTINUED_GAMEPLAY':
            return {
                ...state,
                bossLives: initialState.bossLives, 
                enemies: [],
                enemyBullets: [], 
                asteroids: [],
                blackHoles: [],
               
            };
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

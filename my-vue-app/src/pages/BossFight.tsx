import React from "react";
import "../styles/Gameplay.css";
import Player from "../components/Player";
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';
import { playerMovement } from "../components/Player";
import Bullet from "../components/Bullet";
import { Boss1 } from "../components/Boss";


const BossFight: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);


    // Pohyb hráče pomocí klávesnice
    playerMovement();
    
    // práce s logikou z reduceru
  

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_GAME_STATE'});
    }, 100); 

    return () => clearInterval(interval);
  }, [dispatch]);
    
    return (
        <div className="gameplay-container">
            <h1>Boss Fight</h1>
            <Player position={state.playerPosition} />
            {state.bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet} />

      ))}
      <Boss1 position={state.bossPosition} />
        </div>
    );
};

export default BossFight;
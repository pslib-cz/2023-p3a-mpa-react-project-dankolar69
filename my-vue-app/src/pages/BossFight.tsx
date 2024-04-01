import React from "react";
import "../styles/Gameplay.css";
import Player from "../components/Player";
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';
import { playerMovement } from "../components/Player";
import Bullet from "../components/Bullet";
import { Boss1 } from "../components/Boss";
import { detectCollision } from "../components/GameReducer";
import { useNavigate } from "react-router-dom";


const BossFight: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);
    const navigate = useNavigate();


    // Pohyb hráče pomocí klávesnice
    playerMovement();
    
    // práce s logikou z reduceru

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_BOSSFIGHT_STATE'});
      dispatch({ type: 'UPDATE_PLAYER_MOVEMENT'});
    }, 100); 

    return () => clearInterval(interval);
  }, [dispatch]);

  
  // smrt hráče
  if (state.gameOver) {
    
    navigate('/dead');
  
}
    
    return (
        <div className="gameplay-container">
            <h1 style={{ color: 'white' }}>Boss Fight</h1>
            <h2 style={{ color: 'white' }}>Lives: {state.lives}</h2>
            <Player position={state.playerPosition} />
            {state.bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet} />

      ))}
      <Boss1 position={state.bossPosition} />
        </div>
    );
};

export default BossFight;
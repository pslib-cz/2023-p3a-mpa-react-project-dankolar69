import React from "react";
import { useContext } from 'react';
import { GameContext } from '../providers/ContextProvider';
import '../styles/Main.css';
import { useNavigate } from 'react-router-dom';


const DeadScreen: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);
    const navigate = useNavigate();

    const handleRestart = () => {
        dispatch({ type: 'RESET_GAME' });
        navigate('/');
    };
        return (
          <div className="game-over-container">
            <div className="game-over">
              <h2>Game Over</h2>
              <p>Your score: {state.score}</p>
              <button onClick={handleRestart}>Restart</button>
            </div>
        </div>
          );
    
};

export default DeadScreen;
import React from "react";
import { useContext, useState } from 'react';
import { GameContext } from '../providers/ContextProvider';
import '../styles/Main.css';
import { useNavigate } from 'react-router-dom';

export type Score = {
  nickname: string;
  score: number;
};

const DeadScreen: React.FC = () => {
    const { state, dispatch } = useContext(GameContext);
    const navigate = useNavigate();
    
    const [nickname, setNickname] = useState('');
    
  
  
  
  

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newScore: Score = { nickname, score: state.score };
        const scores:Score[] = JSON.parse(localStorage.getItem('gameScores') || '[]');
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('gameScores', JSON.stringify(scores));
        handleRestart();
    };

    
    const handleRestart = () => {
        dispatch({ type: 'RESET_GAME' });
        navigate('/');
    };
        return (
          <div className="game-over-container">
            <div className="game-over">
              <h2>Game Over</h2>
              <p>Your score: {state.score}</p>
              <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    required
                />
                <button type="submit">Submit Score</button>
            </form>
              
            </div>
        </div>
          );
    
};

export default DeadScreen;
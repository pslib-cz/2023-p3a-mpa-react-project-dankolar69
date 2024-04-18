import React, { useState, useEffect } from 'react';
import { Score } from './DeadScreen';
const Ranking = () => {
    const [scores, setScores] = useState<Score[]>([]);

    useEffect(() => {
        const savedScores: Score[] = JSON.parse(localStorage.getItem('gameScores') || '[]') as Score[];
        savedScores.sort((a, b) => b.score - a.score);
        setScores(savedScores);
    }, []);

    return (
        <div>
            <h1>Ranking</h1>
            <ul>
                {scores.map((score, index) => (
                    <li key={index}>{score.nickname}: {score.score}</li>
                ))}
            </ul>
        </div>
    );
};

export default Ranking;

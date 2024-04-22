import  { useState, useEffect } from 'react';
import { Score } from './DeadScreen';
import '../styles/Ranking.css';
import { Link } from 'react-router-dom';


const Ranking = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const topScores = scores.slice(0, 10);
    const displayScores = [...topScores, ...new Array(10 - topScores.length).fill({ nickname: 'X', score: 'X' })];  

    useEffect(() => {
        const savedScores: Score[] = JSON.parse(localStorage.getItem('gameScores') || '[]') as Score[];
        savedScores.sort((a, b) => b.score - a.score);
        setScores(savedScores);
    }, []);

    

    return (
        <div className='ranking-bg'>
            <div className="ranking-container">
                <h1 className="ranking-title">TOP 10 SPACE SHOOTERS</h1>
                <ul className="ranking-list">
                    {displayScores.map((score, index) => (
                        <li key={index} className="ranking-item">{index + 1}. {score.nickname}: {score.score}</li>
                    ))}
                </ul>
                <Link to="/" className="ranking-back-button">Back to Menu</Link>
            </div>
        </div>
    );
};

export default Ranking;

import React from "react";
import "../styles/Gameplay.css";
import Player from "../components/Player";

const BossFight: React.FC = () => {
    const playerPosition = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });



    
    return (
        <div className="gameplay-container">
            <h1>Boss Fight</h1>
            <Player position={playerPosition.current} />
        </div>
    );
};

export default BossFight;
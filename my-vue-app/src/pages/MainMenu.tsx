import React from "react";
import "../styles/Main.css";
import { Link } from "react-router-dom";


 const MainMenu: React.FC = () => {
    return (
        
        <div className="container">
            <h1 className="title">Space Shooter</h1>
            <Link to="/gameplay" className="link"> 
                <button className="button">
                    <a>Start Game</a>
                </button>
                
            </Link>
            <button className="button">
                    <a>Settings</a>
            </button>
            <button className="button">
                    <a>Quit</a>
            </button>
        </div>
    );
};

export default MainMenu;
import React from "react";
import "../styles/Main.css";
import { Link } from "react-router-dom";


 const MainMenu: React.FC = () => {
    return (
        
        <div className="container">
            <h1 className="title">Space Shooter</h1>
            <Link to="/gameplay" className="link"> 
                <button className="button">
                    Start Game
                </button>
                
            </Link>
            <Link to="/ranking" className="link">
                <button className="button">
                    Ranking
                </button>
            </Link>
            <Link to="/shop" className="link">
                <button className="button">
                    Shop
                </button>
            </Link>
            
        </div>
    );
};

export default MainMenu;
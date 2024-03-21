import React from "react";

import { Link } from "react-router-dom";

 const MainMenu: React.FC = () => {
    return (
        <div>
            <Link to="/gameplay"> 
                <button>
                    <a>Start Game</a>
                </button>
            </Link>
        </div>
    );
};

export default MainMenu;
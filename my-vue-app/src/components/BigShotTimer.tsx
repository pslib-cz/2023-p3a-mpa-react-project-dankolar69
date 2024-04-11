import React, { useContext } from "react";
import { GameContext } from "../providers/ContextProvider"; // Předpokládáme existenci tohoto kontextu

const BigShotTimer = () => {
  const { state } = useContext(GameContext);
  
  return (
    <div style={{ color: "white" }}>
        {!state.bigShotCooldown && state.upgrades.find(upgrade => upgrade.name === 'Big Shot' && upgrade.owned) && <p>Use BigShot by E</p>}
        {state.bigShotCooldown && <p>Možnost znovu použít BigShot za: {state.bigShotCooldownTimeLeft} s</p>}
      
    </div>
  );
};

export default BigShotTimer;

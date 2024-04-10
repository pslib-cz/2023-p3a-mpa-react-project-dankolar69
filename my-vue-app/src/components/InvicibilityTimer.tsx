import React from "react";
import { useContext } from "react";
import { GameContext } from "../providers/ContextProvider";

const InvincibilityTimer = () => {
    const { state } = useContext(GameContext); // Předpokládáme použití React Contextu
  
    return (
      <div style={{color:"white"}}>
        {!state.isInvincible && state.upgrades.find(upgrade => upgrade.name === 'Invincibility' && upgrade.owned) && <p>Use Invicibility by Q</p>}
        {state.isInvincible && <p>Neviditelnost končí za: {state.invincibilityTimeLeft} s</p>}
        {!state.isInvincible && state.invincibilityCooldown && <p>Možnost znovu použít neviditelnost za: {state.invincibilityCooldownTimeLeft} s</p>}
      </div>
    );
  }

export default InvincibilityTimer;
import React from "react";
import { useContext } from "react";
import { GameContext } from "../providers/ContextProvider";

const InvisibilityTimer = () => {
  const { state } = useContext(GameContext);

  
  const calculateProgress = (timeLeft: number, maxTime:number) => {
    const radius = 18; 
    const circumference = 2 * Math.PI * radius;
    const offset = ((maxTime - timeLeft) / maxTime) * circumference;
    return { circumference, offset };
  };

  return (
    <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
      {!state.isInvincible && !state.invisibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invisibility' && upgrade.owned) && <p>Press Q to use invisibility</p>}

      {state.isInvincible && (
        <div>
          
          <svg width="50" height="50" viewBox="0 0 40 40">
            <circle stroke="grey" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20" />
            <circle stroke="green" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20"
              strokeDasharray={calculateProgress(state.invisibilityTimeLeft, 10).circumference}
              strokeDashoffset={calculateProgress(state.invisibilityTimeLeft, 10).offset}
              transform="rotate(-90 20 20)" />
            <text x="50%" y="50%" textAnchor="middle" stroke="#fff" strokeWidth="1px" dy=".3em">{state.invisibilityTimeLeft}s</text>
          </svg>
        </div>
      )}

      {!state.isInvincible && state.invisibilityCooldown && (
        <div>
          
          <svg width="50" height="50" viewBox="0 0 40 40">
            <circle stroke="grey" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20" />
            <circle stroke="red" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20"
              strokeDasharray={calculateProgress(state.invisibilityCooldownTimeLeft, 30).circumference}
              strokeDashoffset={calculateProgress(state.invisibilityCooldownTimeLeft, 30).offset}
              transform="rotate(-90 20 20)" />
            <text x="50%" y="50%" textAnchor="middle" stroke="#fff" strokeWidth="1px" dy=".3em">{state.invisibilityCooldownTimeLeft}s</text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default InvisibilityTimer;

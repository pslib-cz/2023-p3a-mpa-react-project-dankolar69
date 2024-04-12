import React from "react";
import { useContext } from "react";
import { GameContext } from "../providers/ContextProvider";

const InvincibilityTimer = () => {
  const { state } = useContext(GameContext);

  // Calculate the stroke dash array based on the time left and max time
  const calculateProgress = (timeLeft: number, maxTime:number) => {
    const radius = 18; // radius of the circle
    const circumference = 2 * Math.PI * radius;
    const offset = ((maxTime - timeLeft) / maxTime) * circumference;
    return { circumference, offset };
  };

  return (
    <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
      {!state.isInvincible && !state.invincibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invincibility' && upgrade.owned) && <p>Press Q to use Invincibility</p>}

      {state.isInvincible && (
        <div>
          
          <svg width="50" height="50" viewBox="0 0 40 40">
            <circle stroke="grey" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20" />
            <circle stroke="green" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20"
              strokeDasharray={calculateProgress(state.invincibilityTimeLeft, 10).circumference}
              strokeDashoffset={calculateProgress(state.invincibilityTimeLeft, 10).offset}
              transform="rotate(-90 20 20)" />
            <text x="50%" y="50%" textAnchor="middle" stroke="#fff" strokeWidth="1px" dy=".3em">{state.invincibilityTimeLeft}s</text>
          </svg>
        </div>
      )}

      {!state.isInvincible && state.invincibilityCooldown && (
        <div>
          
          <svg width="50" height="50" viewBox="0 0 40 40">
            <circle stroke="grey" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20" />
            <circle stroke="red" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20"
              strokeDasharray={calculateProgress(state.invincibilityCooldownTimeLeft, 30).circumference}
              strokeDashoffset={calculateProgress(state.invincibilityCooldownTimeLeft, 30).offset}
              transform="rotate(-90 20 20)" />
            <text x="50%" y="50%" textAnchor="middle" stroke="#fff" strokeWidth="1px" dy=".3em">{state.invincibilityCooldownTimeLeft}s</text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default InvincibilityTimer;

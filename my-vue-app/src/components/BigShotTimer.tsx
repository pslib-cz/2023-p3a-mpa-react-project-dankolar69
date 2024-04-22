import { useContext } from "react";
import { GameContext } from "../providers/ContextProvider";

const BigShotTimer = () => {
  const { state } = useContext(GameContext);

  
  const calculateProgress = (timeLeft: number, maxTime: number) => {
    const radius = 18; 
    const circumference = 2 * Math.PI * radius;
    const offset = ((maxTime - timeLeft) / maxTime) * circumference;
    return { circumference, offset };
  };

  return (
    <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
      {!state.bigShotCooldown && state.upgrades.find(upgrade => upgrade.name === 'Big Shot' && upgrade.owned) && <p>Press E to use Big Shot</p>}
      
      {state.bigShotCooldown && (
        <div >
          
          <svg width="50" height="50" viewBox="0 0 40 40">
            <circle stroke="grey" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20" />
            <circle stroke="red" strokeWidth="4" fill="transparent" r="18" cx="20" cy="20"
              strokeDasharray={calculateProgress(state.bigShotCooldownTimeLeft, 30).circumference} 
              strokeDashoffset={calculateProgress(state.bigShotCooldownTimeLeft, 30).offset}
              transform="rotate(-90 20 20)" />
            <text x="50%" y="50%" textAnchor="middle" stroke="#fff" strokeWidth="1px" dy=".3em">{state.bigShotCooldownTimeLeft}s</text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default BigShotTimer;

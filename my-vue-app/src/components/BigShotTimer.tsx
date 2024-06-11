import { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "../providers/ContextProvider";

const BigShotTimer = () => {
  const { state, dispatch } = useContext(GameContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const bigShotCooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateProgress = (timeLeft:number, maxTime:number) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = ((maxTime - timeLeft) / maxTime) * circumference;
    return { circumference, offset };
  };

  const handleActivateBigShot = () => {
    if (state.upgrades.find(upgrade => upgrade.name === 'Big Shot' && upgrade.owned) && !state.bigShotCooldown) {
      dispatch({ type: 'ACTIVATE_BIG_SHOT', payload: { cooldown: 30 } });
      dispatch({ type: 'ADD_MEGA_BULLET', payload: { playerPosition: state.playerPosition } });

      if (!bigShotCooldownTimerRef.current) {
        let bigShotCooldownDuration = 30;
          bigShotCooldownTimerRef.current = setInterval(() => {
            bigShotCooldownDuration -= 1;
            dispatch({ type: 'DECREMENT_BIG_SHOT_COOLDOWN_TIMER', payload: { timeLeft: bigShotCooldownDuration } });
    
            if (bigShotCooldownDuration <= 0) {
              clearInterval(bigShotCooldownTimerRef.current!);
              bigShotCooldownTimerRef.current = null;
              dispatch({ type: 'RESET_BIG_SHOT_COOLDOWN' });
            }
          }, 1000);}
    }
    console.log("Activating Big Shot");
  };

  useEffect(() => {
   
    return () => {
      if (bigShotCooldownTimerRef.current) {
        clearInterval(bigShotCooldownTimerRef.current);
      }
    };
  }, []);

  return (
    <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
      {!state.bigShotCooldown && state.upgrades.find(upgrade => upgrade.name === 'Big Shot' && upgrade.owned) && (
        isMobile ? <button onClick={handleActivateBigShot}>Use Big Shot</button> : <p>Press E to use Big Shot</p>
      )}

      {state.bigShotCooldown && (
        <div>
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

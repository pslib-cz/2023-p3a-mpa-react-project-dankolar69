import { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "../providers/ContextProvider";

const InvisibilityTimer = () => {
  const { state, dispatch } = useContext(GameContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const invisibilityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateProgress = (timeLeft: number, maxTime: number) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = ((maxTime - timeLeft) / maxTime) * circumference;
    return { circumference, offset };
  };

  const handleActivateInvisibility = () => {
    if (state.upgrades.find(upgrade => upgrade.name === 'Invisibility' && upgrade.owned) && state.invisibilityCooldown === false) {
      dispatch({ type: 'ACTIVATE_INVISIBILITY', payload: { duration: 10, cooldown: 30 } });

              if (!invisibilityTimerRef.current) {
                let invisibilityDuration = 10;
                invisibilityTimerRef.current = setInterval(() => {
                  invisibilityDuration -= 1;
                  dispatch({ type: 'DECREMENT_INVISIBILITY_TIMER', payload: { timeLeft: invisibilityDuration } });

                  if (invisibilityDuration <= 0) {
                    clearInterval(invisibilityTimerRef.current!);
                    invisibilityTimerRef.current = null;
                    dispatch({ type: 'RESET_INVISIBILITY' });

                    // Start cooldown timer
                    let cooldownDuration = 30;
                    invisibilityTimerRef.current = setInterval(() => {
                      cooldownDuration -= 1;
                      dispatch({ type: 'DECREMENT_COOLDOWN_TIMER', payload: { timeLeft: cooldownDuration } });

                      if (cooldownDuration <= 0) {
                        clearInterval(invisibilityTimerRef.current!);
                        invisibilityTimerRef.current = null;
                        dispatch({ type: 'RESET_INVISIBILITY_COOLDOWN' });
                      }
                    }, 1000);
                  }
                }, 1000); 
              }
    }
    console.log("Activating Invisibility");
  };

  return (
    <div style={{ color: "white", fontFamily: "Arial, sans-serif" }}>
      {!state.isInvincible && !state.invisibilityCooldown && state.upgrades.find(upgrade => upgrade.name === 'Invisibility' && upgrade.owned) && (
        isMobile ? <button onClick={handleActivateInvisibility}>Use Invisibility</button> : <p>Press Q to use invisibility</p>
      )}

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

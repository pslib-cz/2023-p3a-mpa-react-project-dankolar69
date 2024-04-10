import React, { useState, useEffect } from 'react';


const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const [audio] = useState(new Audio());

    const togglePlay = () => {
      if (audio) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

  useEffect(() => {
    const trackMap: Record<string, string> = {
      '/gameplay': '/src/assets/audio/song2.ogg',
      '/boss': '/src/assets/audio/boss1.mp3',
     
    };
    audio.pause();
    const currentTrack = trackMap[location.pathname];
        if (currentTrack) {
            audio.src = currentTrack;
            audio.load();
            if (isPlaying) {
                audio.play().catch(e => {console.error('Playback failed.', e);setIsPlaying(false);});
            }
        }

        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
    }, [location.pathname, isPlaying, audio]);

  return (
      <div>
          <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
          
      </div>
  );
};

export default AudioPlayer;

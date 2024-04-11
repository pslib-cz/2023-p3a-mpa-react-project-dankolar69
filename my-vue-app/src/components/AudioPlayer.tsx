import React, { useState, useEffect } from 'react';


const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const [audio] = useState(new Audio());

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error('Playback failed.', e);
          setIsPlaying(false);
        });
      }
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
      audio.oncanplaythrough = () => {  
        if (isPlaying) {
          audio.play().catch(e => {
            console.error('Playback failed.', e);
            setIsPlaying(false);
          });
        }
      }
    }

        return () => {
          audio.pause();
          
        };
    }, [location.pathname, isPlaying, audio]);

  return (
      <div>
          <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
          
      </div>
  );
};

export default AudioPlayer;

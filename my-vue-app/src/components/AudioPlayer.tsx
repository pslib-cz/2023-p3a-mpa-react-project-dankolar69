import React, { useState, useEffect, useContext } from 'react';
import gameplayS2 from '../assets/audio/song2.mp3';
import bossS1 from '../assets/audio/boss1.mp3';
import bossS2 from '../assets/audio/boss2.mp3';
import { AudioPlayerContext } from '../providers/AudioPlayerProvider';



const AudioPlayer: React.FC = () => {
  const {isPlaying, setIsPlaying} = useContext(AudioPlayerContext);
  const [audio] = useState<HTMLAudioElement>(new Audio());

  
  const togglePlay = () => {
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
    setIsPlaying(!isPlaying);
    
  };

  useEffect(() => {
    const trackMap: Record<string, string> = {
      '/gameplay': gameplayS2,
      '/boss': bossS1,
      '/boss2': bossS2,
    };

    const hashPath = window.location.hash.replace(/^#/, ''); 
    const currentTrack = trackMap[hashPath];

    if (currentTrack) {
      audio.pause();
      audio.src = currentTrack;
      audio.load();
      audio.oncanplaythrough = () => {
        if (isPlaying) {
          audio.play().catch(e => {
            console.error('Playback failed.', e);
            setIsPlaying(false);
          });
        }
      };
    }

    // Clean up function
    return () => {
      audio.pause();
      audio.src = '';
  
    };
  }, [window.location.hash, isPlaying]);

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default AudioPlayer;

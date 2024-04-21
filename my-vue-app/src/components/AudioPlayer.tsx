import React, { useState, useEffect } from 'react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio] = useState(new Audio());
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Index to track which gameplay song is playing

  // Define songs for gameplay and a static track for boss
  const gameplaySongs = ['/src/assets/audio/song1.ogg', '/src/assets/audio/song2.ogg'];
  const bossTrack = '/src/assets/audio/boss1.mp3';

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
  };

  useEffect(() => {
    function handleSongEnd() {
      // Cycle through gameplay songs
      if (location.pathname === '/gameplay') {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % gameplaySongs.length);
      }
    }

    // Set the source depending on the route
    audio.src = (location.pathname === '/boss') ? bossTrack : gameplaySongs[currentSongIndex];
    audio.load();

    audio.addEventListener('ended', handleSongEnd);

    // Automatically play when ready
    audio.oncanplaythrough = () => {  
      if (isPlaying) {
        audio.play().catch(e => {
          console.error('Playback failed.', e);
          setIsPlaying(false);
        });
      }
    };

    return () => {
      audio.removeEventListener('ended', handleSongEnd);
      audio.pause();
    };
  }, [location.pathname, isPlaying, audio, currentSongIndex]);

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default AudioPlayer;

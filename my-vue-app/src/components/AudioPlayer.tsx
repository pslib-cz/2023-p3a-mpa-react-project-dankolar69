import React, { useState, useEffect } from 'react';

type AudioPlayerProps = {
  tracks: string[]; 
  autoPlay?: boolean;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, autoPlay = false }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioRef = React.useRef<HTMLAudioElement>(new Audio(tracks[0]));

  // Sledování, zda je skladba připravena k přehrání
  useEffect(() => {
    const handleLoadedData = () => {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback was prevented after loading new source.', error);
          setIsPlaying(false);
        });
      }
    };

    audioRef.current.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audioRef.current.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isPlaying]);

  // Přepínání skladby
  useEffect(() => {
    audioRef.current.src = tracks[currentTrackIndex];
    if (autoPlay || isPlaying) {
      audioRef.current.load(); // Explicitně načíst nový zdroj
    }
  }, [currentTrackIndex, tracks, autoPlay, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // AutoPlay a cyklus skladeb
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }

    const handleEnded = () => {
      const nextIndex = currentTrackIndex + 1 < tracks.length ? currentTrackIndex + 1 : 0;
      setCurrentTrackIndex(nextIndex);
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, currentTrackIndex, tracks.length]);

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      Song: {tracks[currentTrackIndex]}
    </div>
  );
};

export default AudioPlayer;

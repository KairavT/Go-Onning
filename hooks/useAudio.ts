import { audioService } from '@/services/audioService';
import { useEffect, useState } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize audio service
    audioService.initialize();
  }, []);

  const play = async () => {
    await audioService.play();
    setIsPlaying(true);
  };

  const pause = async () => {
    await audioService.pause();
    setIsPlaying(false);
  };

  const stop = async () => {
    await audioService.stop();
    setIsPlaying(false);
  };

  const setVolume = async (volume: number) => {
    await audioService.setVolume(volume);
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
    setVolume,
  };
}

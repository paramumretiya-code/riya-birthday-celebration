import React, { useEffect, useRef, useState } from 'react';

interface AudioControllerProps {
  onAudioReady?: (playFn: () => Promise<boolean>) => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({ onAudioReady }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const wasPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    // Official track: BIRTHDAY WISH – HR71DP
    const audio = new Audio();
    
    // Check codec support: High-fidelity AAC (M4A) or MP3
    const canPlayM4A = audio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
    audio.src = canPlayM4A !== '' ? './assets/birthday-wish-hr71dp.m4a' : './assets/birthday-wish-hr71dp.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    // Error handling - fallback to MP3 if M4A fails
    audio.addEventListener('error', () => {
      if (audio.src.includes('.m4a')) {
        audio.src = './assets/birthday-wish-hr71dp.mp3';
        audio.load();
      } else {
        console.warn("Audio failed to load for HR71DP - BIRTHDAY WISH");
        setIsAvailable(false);
      }
    });

    const playWithFade = async (): Promise<boolean> => {
      if (!audioRef.current) return false;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem('riya_birthday_music_pref', 'true');

        // Smooth 600ms volume fade in
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        let vol = 0;
        audioRef.current.volume = 0;
        const step = 0.05;
        fadeIntervalRef.current = window.setInterval(() => {
          if (!audioRef.current) return;
          vol = Math.min(0.75, vol + step);
          audioRef.current.volume = vol;
          if (vol >= 0.75 && fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
        }, 40);

        return true;
      } catch (err) {
        console.warn("Autoplay was prevented:", err);
        setIsPlaying(false);
        return false;
      }
    };

    const pauseWithFade = () => {
      if (!audioRef.current) return;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      let vol = audioRef.current.volume;
      const step = 0.08;
      fadeIntervalRef.current = window.setInterval(() => {
        if (!audioRef.current) return;
        vol = Math.max(0, vol - step);
        audioRef.current.volume = vol;
        if (vol <= 0) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          audioRef.current.pause();
          setIsPlaying(false);
          localStorage.setItem('riya_birthday_music_pref', 'false');
        }
      }, 50);
    };

    if (onAudioReady) {
      onAudioReady(playWithFade);
    }

    // Expose toggle on window for global triggering from Cover section CTA
    (window as any).__playBirthdayMusic = playWithFade;
    (window as any).__pauseBirthdayMusic = pauseWithFade;

    // Handle background / phone lock & resume
    const handleVisibility = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) {
          wasPlayingRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingRef.current) {
          wasPlayingRef.current = false;
          playWithFade();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [onAudioReady]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      (window as any).__pauseBirthdayMusic?.();
    } else {
      (window as any).__playBirthdayMusic?.();
    }
  };

  if (!isAvailable) return null;

  return (
    <button
      onClick={toggleMusic}
      title={isPlaying ? "Pause: HR71DP – BIRTHDAY WISH" : "Play: HR71DP – BIRTHDAY WISH"}
      aria-label="Toggle Birthday Music: HR71DP – BIRTHDAY WISH"
      className="fixed z-50 flex items-center justify-center w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-white/90 backdrop-blur-sm border border-[#C9A24D]/40 shadow-[0_4px_16px_rgba(201,162,77,0.22)] active:scale-[0.97] transition-transform text-[#9C7424] cursor-pointer"
      style={{
        top: 'calc(14px + env(safe-area-inset-top, 0px))',
        right: 'calc(14px + env(safe-area-inset-right, 0px))',
      }}
    >
      {isPlaying ? (
        <div className="flex items-end gap-[2.5px] h-[15px]">
          <span className="w-[2.5px] bg-[#9C7424] rounded-full animate-[pulse_0.8s_infinite_alternate]" style={{ height: '60%' }} />
          <span className="w-[2.5px] bg-[#C9A24D] rounded-full animate-[pulse_1.1s_0.2s_infinite_alternate]" style={{ height: '100%' }} />
          <span className="w-[2.5px] bg-[#9C7424] rounded-full animate-[pulse_0.7s_0.1s_infinite_alternate]" style={{ height: '40%' }} />
          <span className="w-[2.5px] bg-[#E9D08F] rounded-full animate-[pulse_0.9s_0.3s_infinite_alternate]" style={{ height: '80%' }} />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#9C7424]/80">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}
    </button>
  );
};

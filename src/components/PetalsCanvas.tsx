import React, { useEffect, useMemo, useRef, useState } from 'react';

// ========================================================
// FALL_CONFIG: Easily tweak particle counts across devices
// ========================================================
export const FALL_CONFIG = {
  mobile:  { petals: 18, flowers: 6, stars: 22 },
  desktop: { petals: 26, flowers: 9, stars: 34 },
};

interface ParticleItem {
  id: string;
  symbolId: string;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  animName: string;
}

interface PetalsCanvasProps {
  section?: 'cover' | 'wishes' | 'cake' | 'global';
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ section = 'wishes' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);
  const [fpsThrottled, setFpsThrottled] = useState<boolean>(false);
  const [isOffscreen, setIsOffscreen] = useState<boolean>(false);
  const [isDocHidden, setIsDocHidden] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // 1. Device and preference detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reduced motion check
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);

    // Screen size detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // Hardware capability detection: cores <= 4 or RAM <= 2GB
    const nav = navigator as any;
    const lowCores = nav.hardwareConcurrency && nav.hardwareConcurrency <= 4;
    const lowMemory = nav.deviceMemory && nav.deviceMemory <= 2;
    if (lowCores || lowMemory) {
      setIsLowEnd(true);
    }

    // Visibility detection (pause when tab hidden or phone locked)
    const handleVisibility = () => setIsDocHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      mql.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // 2. FPS Watchdog: Auto-reduce particles if FPS < 45 over 2 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;

    let frameCount = 0;
    let startTime = performance.now();
    let animId: number;
    let lowFpsStreak = 0;

    const measureFps = (now: number) => {
      frameCount++;
      const elapsed = now - startTime;

      if (elapsed >= 1000) {
        const currentFps = (frameCount * 1000) / elapsed;
        frameCount = 0;
        startTime = now;

        if (currentFps < 45) {
          lowFpsStreak++;
          if (lowFpsStreak >= 2) {
            setFpsThrottled(true);
          }
        } else {
          lowFpsStreak = 0;
        }
      }

      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion]);

  // 3. IntersectionObserver: Pause particles when section is offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsOffscreen(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 4. Compute Particle Counts
  const particles = useMemo(() => {
    if (prefersReducedMotion) return [];

    const base = isMobile ? FALL_CONFIG.mobile : FALL_CONFIG.desktop;

    // Scale factors:
    // Cover is lighter (60%) so card art stays clean
    // Low-end device: 60%
    // FPS throttled: 60% (-40%)
    const sectionFactor = section === 'cover' ? 0.6 : 1.0;
    const deviceFactor = isLowEnd ? 0.6 : 1.0;
    const perfFactor = fpsThrottled ? 0.6 : 1.0;
    const totalScale = sectionFactor * deviceFactor * perfFactor;

    const petalCount = Math.max(3, Math.round(base.petals * totalScale));
    const flowerCount = Math.max(1, Math.round(base.flowers * totalScale));
    const starCount = Math.max(4, Math.round(base.stars * totalScale));

    const list: ParticleItem[] = [];

    // Helper for pseudo-random deterministic seeding
    let seed = section.charCodeAt(0) * 17 + (isMobile ? 11 : 29);
    const nextRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // A. Petals
    for (let i = 0; i < petalCount; i++) {
      const duration = 9 + nextRandom() * 9; // 9s to 18s fall
      const delay = -(nextRandom() * duration); // Staggered negative delay so screen starts populated
      const size = 12 + nextRandom() * 9; // 12-21px
      const left = Math.round(nextRandom() * 96);
      const opacity = 0.4 + nextRandom() * 0.35; // 0.4 - 0.75
      const animName = nextRandom() > 0.5 ? 'fallSwayA' : 'fallSwayB';

      list.push({
        id: `p-${section}-${i}`,
        symbolId: 'symbol-blush-petal',
        size,
        left,
        duration: Math.round(duration * 10) / 10,
        delay: Math.round(delay * 10) / 10,
        opacity: Math.round(opacity * 100) / 100,
        animName,
      });
    }

    // B. Tiny 5-Petal Blush Flowers (~14-22px)
    for (let i = 0; i < flowerCount; i++) {
      const duration = 10 + nextRandom() * 8; // 10s to 18s
      const delay = -(nextRandom() * duration);
      const size = 14 + nextRandom() * 8; // 14-22px
      const left = Math.round(nextRandom() * 94);
      const opacity = 0.45 + nextRandom() * 0.32; // 0.45 - 0.77
      const animName = nextRandom() > 0.5 ? 'fallSwayA' : 'fallSwayB';

      list.push({
        id: `f-${section}-${i}`,
        symbolId: 'symbol-blossom-flower',
        size,
        left,
        duration: Math.round(duration * 10) / 10,
        delay: Math.round(delay * 10) / 10,
        opacity: Math.round(opacity * 100) / 100,
        animName,
      });
    }

    // C. 4-point Stars & Sparkles (gold and light gold, ~8-14px)
    for (let i = 0; i < starCount; i++) {
      const duration = 8.5 + nextRandom() * 9.5; // 8.5s to 18s
      const delay = -(nextRandom() * duration);
      const size = 8 + nextRandom() * 6; // 8-14px
      const left = Math.round(nextRandom() * 96);
      const opacity = 0.4 + nextRandom() * 0.38; // 0.4 - 0.78
      const symbolId = nextRandom() > 0.45 ? 'symbol-star-gold' : 'symbol-star-light-gold';

      list.push({
        id: `s-${section}-${i}`,
        symbolId,
        size,
        left,
        duration: Math.round(duration * 10) / 10,
        delay: Math.round(delay * 10) / 10,
        opacity: Math.round(opacity * 100) / 100,
        animName: 'fallStarDrift',
      });
    }

    return list;
  }, [section, isMobile, isLowEnd, fpsThrottled, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const isPaused = isDocHidden || isOffscreen;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Reusable SVG Definitions via <use> */}
      <svg className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <defs>
          {/* Rose Petal Gradient */}
          <radialGradient id="rose-petal-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF9F5" />
            <stop offset="50%" stopColor="#F4CFC6" />
            <stop offset="100%" stopColor="#E3A3A0" />
          </radialGradient>

          {/* Gold Star Gradient */}
          <linearGradient id="gold-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="50%" stopColor="#E9D08F" />
            <stop offset="100%" stopColor="#C9A24D" />
          </linearGradient>

          {/* Light Gold Star Gradient */}
          <linearGradient id="light-gold-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF2CC" />
            <stop offset="100%" stopColor="#E9D08F" />
          </linearGradient>

          {/* 1. Petal Symbol */}
          <g id="symbol-blush-petal" viewBox="0 0 24 24">
            <path
              d="M12 2 C18 4 19 16 12 22 C5 16 6 4 12 2 Z"
              fill="url(#rose-petal-grad)"
            />
          </g>

          {/* 2. 5-Petal Blush Blossom Symbol */}
          <g id="symbol-blossom-flower" viewBox="0 0 24 24">
            <path d="M12 2 C13.5 2 15 5 15 8 C15 10 13.5 11 12 11 C10.5 11 9 10 9 8 C9 5 10.5 2 12 2 Z" fill="url(#rose-petal-grad)" />
            <path d="M12 2 C13.5 2 15 5 15 8 C15 10 13.5 11 12 11 C10.5 11 9 10 9 8 C9 5 10.5 2 12 2 Z" transform="rotate(72 12 12)" fill="url(#rose-petal-grad)" />
            <path d="M12 2 C13.5 2 15 5 15 8 C15 10 13.5 11 12 11 C10.5 11 9 10 9 8 C9 5 10.5 2 12 2 Z" transform="rotate(144 12 12)" fill="url(#rose-petal-grad)" />
            <path d="M12 2 C13.5 2 15 5 15 8 C15 10 13.5 11 12 11 C10.5 11 9 10 9 8 C9 5 10.5 2 12 2 Z" transform="rotate(216 12 12)" fill="url(#rose-petal-grad)" />
            <path d="M12 2 C13.5 2 15 5 15 8 C15 10 13.5 11 12 11 C10.5 11 9 10 9 8 C9 5 10.5 2 12 2 Z" transform="rotate(288 12 12)" fill="url(#rose-petal-grad)" />
            {/* Center golden pistil */}
            <circle cx="12" cy="12" r="2.2" fill="#E9D08F" />
            <circle cx="12" cy="12" r="1.1" fill="#C9A24D" />
          </g>

          {/* 3. 4-point Star Symbol (Gold) */}
          <g id="symbol-star-gold" viewBox="0 0 24 24">
            <path
              d="M12 0 C12 6.5 17.5 12 24 12 C17.5 12 12 17.5 12 24 C12 17.5 6.5 12 0 12 C6.5 12 12 6.5 12 0 Z"
              fill="url(#gold-star-grad)"
            />
          </g>

          {/* 4. 4-point Star Symbol (Light Gold) */}
          <g id="symbol-star-light-gold" viewBox="0 0 24 24">
            <path
              d="M12 0 C12 6.5 17.5 12 24 12 C17.5 12 12 17.5 12 24 C12 17.5 6.5 12 0 12 C6.5 12 12 6.5 12 0 Z"
              fill="url(#light-gold-star-grad)"
            />
          </g>
        </defs>
      </svg>

      {/* Render Particles */}
      {particles.map((p) => (
        <svg
          key={p.id}
          className="absolute particle-animated"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: 0,
            animation: `${p.animName} ${p.duration}s ${p.delay}s infinite linear`,
            animationPlayState: isPaused ? 'paused' : 'running',
            opacity: p.opacity,
            ['--target-opacity' as any]: p.opacity,
          }}
        >
          <use href={`#${p.symbolId}`} />
        </svg>
      ))}
    </div>
  );
};

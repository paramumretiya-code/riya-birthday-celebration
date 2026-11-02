import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SparkleIcon, HeartIcon } from './SVGIcons';
import { PetalsCanvas } from './PetalsCanvas';

export const CakeSection: React.FC = () => {
  const [hasWished, setHasWished] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  const handleMakeWish = () => {
    // 1. Safe haptic feedback
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    } catch (e) {
      // Ignore vibration error
    }

    setHasWished(true);
    setWishCount((prev) => prev + 1);

    // 2. Confetti cannons from both sides (scaled for mobile performance)
    try {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const count = isMobile ? 38 : 70;

      confetti({
        particleCount: count,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.75 },
        colors: ['#E9D08F', '#C9A24D', '#F4CFC6', '#E3A3A0', '#FBF4EA'],
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: count,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.75 },
        colors: ['#E9D08F', '#C9A24D', '#F4CFC6', '#E3A3A0', '#FBF4EA'],
        disableForReducedMotion: true,
      });

      // Second burst
      setTimeout(() => {
        const secondCount = isMobile ? 28 : 50;
        confetti({
          particleCount: secondCount,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#E9D08F', '#C9A24D', '#F4CFC6'],
          disableForReducedMotion: true,
        });
      }, 350);
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  };

  const scrollToCover = () => {
    const el = document.getElementById('cover-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="cake-section"
      className="relative min-h-[100vh] min-h-[100dvh] min-h-[100svh] w-full flex flex-col items-center justify-between py-6 px-4 max-w-[480px] mx-auto overflow-hidden"
      style={{
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Falling Flowers & Stars Animation (100% count, behind cake photo) */}
      <PetalsCanvas section="cake" />

      {/* SECTION HEADER */}
      <header className="relative z-10 w-full text-center flex flex-col items-center pt-2 select-none">
        <span className="font-['Jost'] text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#9C7424] font-medium mb-1">
          A Sweet Celebration
        </span>

        {/* Dynamic Heading with fluid clamp */}
        <h2 className="font-['Great_Vibes'] fluid-cake-title leading-[1.15] gold-text px-2 min-h-[58px] flex items-center justify-center transition-all duration-500">
          {hasWished ? (
            <span className="animate-[fadeIn_0.6s_ease-out]">
              May all your wishes come true, Riya ✨
            </span>
          ) : (
            <span>Make a wish, Riya</span>
          )}
        </h2>
      </header>

      {/* HERO VISUAL: cake.jpg/cake.webp Container (Full width, feathered edges, slow Ken Burns) */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center my-3 max-h-[64vh] sm:max-h-[66vh]">
        <div className="relative w-full max-h-full aspect-[682/1024] flex items-center justify-center overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(92,58,48,0.25)]">
          
          {/* Photo with 8-10% feathered top/bottom edges & slow Ken Burns */}
          <div className="w-full h-full feather-mask overflow-hidden">
            <picture className="w-full h-full block">
              <source srcSet="./assets/cake.webp" type="image/webp" />
              <img
                src="./assets/cake.jpg"
                alt="Birthday Cake for Riya with golden topper and roses"
                width="682"
                height="1024"
                className="w-full h-full object-cover select-none pointer-events-none animate-[kenBurns_14s_infinite_alternate_ease-in-out]"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>

          {/* ANIMATED LAYERS ON TOP OF CAKE PHOTO (pointer-events-none) */}

          {/* 1. Soft Pulsing Gold Glow behind the "Happy Birthday" Topper */}
          <div
            className={`absolute top-[16%] left-[22%] right-[22%] h-[24%] rounded-full bg-gradient-to-r from-amber-200/25 via-amber-300/40 to-amber-200/25 blur-xl pointer-events-none transition-all duration-700 ${
              hasWished ? 'opacity-90 scale-125' : 'opacity-65 animate-pulse'
            }`}
            aria-hidden="true"
          />

          {/* 2. Twinkling Fairy Lights over Cake Sash and Base */}
          <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            {/* Candle flame flicker in left background */}
            <div className="absolute top-[46.5%] left-[13%]">
              <span className="block w-2.5 h-3.5 bg-amber-300/80 rounded-full blur-[2px] animate-[pulse_0.4s_infinite_alternate]" />
            </div>

            {/* Fairy lights along the pink watercolor sash */}
            <div className="absolute top-[57%] left-[32%] animate-[pulse_1.8s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFF8E7] drop-shadow-[0_0_8px_rgba(255,248,231,1)]" />
            </div>
            <div className="absolute top-[60%] left-[48%] animate-[pulse_2.2s_0.4s_infinite]">
              <SparkleIcon className="w-3.5 h-3.5 text-[#FFEAA7] drop-shadow-[0_0_8px_rgba(255,234,167,1)]" />
            </div>
            <div className="absolute top-[63%] left-[64%] animate-[pulse_1.9s_0.8s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFF8E7] drop-shadow-[0_0_8px_rgba(255,248,231,1)]" />
            </div>
            <div className="absolute top-[61%] left-[78%] animate-[pulse_2.4s_1.2s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFEAA7] drop-shadow-[0_0_8px_rgba(255,234,167,1)]" />
            </div>

            {/* Fairy lights along cake base board */}
            <div className="absolute top-[68%] left-[22%] animate-[pulse_2.5s_0.3s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFF8E7] drop-shadow-[0_0_6px_rgba(255,248,231,0.9)]" />
            </div>
            <div className="absolute top-[71%] left-[38%] animate-[pulse_2.0s_0.9s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFEAA7] drop-shadow-[0_0_6px_rgba(255,234,167,0.9)]" />
            </div>
            <div className="absolute top-[73%] left-[58%] animate-[pulse_2.3s_0.6s_infinite]">
              <SparkleIcon className="w-3.5 h-3.5 text-[#FFF8E7] drop-shadow-[0_0_7px_rgba(255,248,231,1)]" />
            </div>
            <div className="absolute top-[69%] left-[82%] animate-[pulse_2.1s_1.1s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#FFEAA7] drop-shadow-[0_0_6px_rgba(255,234,167,0.9)]" />
            </div>

            {/* Sparkles on the Topper */}
            <div className="absolute top-[21%] left-[38%] animate-[pulse_1.6s_infinite]">
              <SparkleIcon className="w-4 h-4 text-[#FFF] drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
            </div>
            <div className="absolute top-[28%] right-[32%] animate-[pulse_1.9s_0.5s_infinite]">
              <SparkleIcon className="w-3.5 h-3.5 text-[#FFF8E7] drop-shadow-[0_0_8px_rgba(255,248,231,1)]" />
            </div>
          </div>

          {/* 3. Floating Celebration SVG Balloons on Wish */}
          {hasWished && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
              {/* Balloon 1: Gold */}
              <div
                key={`b1-${wishCount}`}
                className="absolute -bottom-10 left-[15%] w-8 h-10 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-tr from-[#C9A24D] to-[#F5E5B8] shadow-md animate-[floatUp_6s_ease-out_forwards]"
              />
              {/* Balloon 2: Blush */}
              <div
                key={`b2-${wishCount}`}
                className="absolute -bottom-10 right-[20%] w-9 h-11 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-tr from-[#E3A3A0] to-[#FFF2EB] shadow-md animate-[floatUp_6.5s_0.4s_ease-out_forwards]"
              />
              {/* Balloon 3: Champagne */}
              <div
                key={`b3-${wishCount}`}
                className="absolute -bottom-10 left-[45%] w-7 h-9 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-tr from-[#E9D08F] to-[#FFFFFF] shadow-md animate-[floatUp_5.8s_0.8s_ease-out_forwards]"
              />
              {/* Floating Heart */}
              <div
                key={`h1-${wishCount}`}
                className="absolute -bottom-6 left-[65%] text-[#E3A3A0] animate-[floatUp_5s_0.2s_ease-out_forwards]"
              >
                <HeartIcon className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER & ACTIONS */}
      <footer className="relative z-10 w-full flex flex-col items-center gap-3">
        {/* Interaction Button: Tap to make a wish */}
        <button
          onClick={handleMakeWish}
          className="relative group overflow-hidden w-full max-w-[320px] min-h-[48px] h-14 rounded-full bg-gradient-to-r from-[#F5E5B8] via-[#C9A24D] to-[#9C7424] text-[#3B2A25] font-['Jost'] font-bold text-[14px] uppercase tracking-[0.14em] shadow-[0_8px_25px_rgba(201,162,77,0.38)] active:scale-[0.97] transition-transform flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-sheen pointer-events-none"
            aria-hidden="true"
          />
          <span>{hasWished ? "Make another wish ✨" : "Tap to make a wish 🎂"}</span>
        </button>

        {/* Back to Cover link */}
        <button
          onClick={scrollToCover}
          className="min-h-[48px] h-12 px-6 flex items-center justify-center text-[12px] font-['Jost'] text-[#9C7424] uppercase tracking-[0.18em] hover:text-[#C9A24D] active:scale-[0.97] transition-all focus:outline-none cursor-pointer select-none"
        >
          ↑ Back to cover
        </button>

        {/* Final Signoff */}
        <p className="font-['Great_Vibes'] text-[24px] sm:text-[26px] text-[#9C7424] mt-1 select-none">
          Made with love, just for you
        </p>
      </footer>
    </section>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ButterflySVG, SparkleIcon } from './SVGIcons';

export const CoverSection: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenSurprise = () => {
    setIsOpened(true);

    // 1. Play Background Music (iOS requirement satisfied on user interaction)
    (window as any).__playBirthdayMusic?.();

    // 2. Gold + Blush Confetti Burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#E9D08F', '#C9A24D', '#F4CFC6', '#E3A3A0', '#FBF4EA'],
        disableForReducedMotion: true,
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.85 },
          colors: ['#E9D08F', '#C9A24D', '#F4CFC6'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.85 },
          colors: ['#E9D08F', '#C9A24D', '#F4CFC6'],
        });
      }, 250);
    } catch (e) {
      console.warn("Confetti error:", e);
    }

    // 3. Smooth-scroll to Wishes section
    setTimeout(() => {
      const el = document.getElementById('wishes-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);
  };

  return (
    <section
      id="cover-section"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between py-4 px-4 max-w-[480px] mx-auto overflow-hidden"
      style={{
        paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* ONLY MAIN TEXT ON COVER: HAPPY BIRTHDAY RIYA (3D Gold Typography) */}
      <header className="w-full text-center flex flex-col items-center pt-2 pb-1 z-20">
        <h1 className="gold-3d-title animate-gold-pulse text-center select-none flex flex-col items-center justify-center">
          <span className="block text-[21px] min-[380px]:text-[25px] sm:text-[28px] font-['Cormorant_Garamond'] font-bold tracking-[0.22em] uppercase">
            HAPPY BIRTHDAY
          </span>
          <span className="block text-[36px] min-[380px]:text-[42px] sm:text-[48px] font-['Cormorant_Garamond'] font-bold tracking-[0.16em] uppercase -mt-1 sm:-mt-1.5">
            RIYA
          </span>
        </h1>
      </header>

      {/* HERO VISUAL: card.jpg/card.webp Container */}
      <div className="relative w-full flex-1 flex items-center justify-center my-2 max-h-[64vh] sm:max-h-[67vh]">
        <div
          className={`relative max-h-full aspect-[682/1024] flex items-center justify-center transition-all duration-700 ${
            isOpened ? 'scale-[1.02] -translate-y-1' : 'animate-float'
          }`}
        >
          {/* Real Photo as Hero Visual (Never cropped, feathered edges) */}
          <picture className="w-full h-full block">
            <source srcSet="./assets/card.webp" type="image/webp" />
            <img
              src="./assets/card.jpg"
              alt="Birthday greeting card for Riya"
              className="w-full h-full object-contain rounded-[20px] shadow-[0_16px_45px_rgba(92,58,48,0.22)] select-none pointer-events-none"
              loading="eager"
            />
          </picture>

          {/* 1. Soft Diagonal Gold Shimmer Sweep across card every ~6s */}
          <div
            className="absolute inset-0 rounded-[20px] pointer-events-none overflow-hidden opacity-45 mix-blend-overlay"
            aria-hidden="true"
          >
            <div
              className="w-full h-full bg-gradient-to-r from-transparent via-[#FFF8E7] to-transparent -translate-x-full animate-[sheenSweep_6s_infinite_ease-in-out]"
            />
          </div>

          {/* 2. Twinkling Gold Glints on Pearls and Gold Hearts */}
          <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            {/* Top-left pearl glint */}
            <div className="absolute top-[8%] left-[28%] animate-pulse">
              <SparkleIcon className="w-3.5 h-3.5 text-[#E9D08F] drop-shadow-[0_0_6px_rgba(233,208,143,0.9)]" />
            </div>

            {/* Top-right flower pearl glint */}
            <div className="absolute top-[28%] right-[22%] animate-[pulse_2.2s_0.8s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#E9D08F] drop-shadow-[0_0_5px_rgba(233,208,143,0.9)]" />
            </div>

            {/* Center gold heart glint */}
            <div className="absolute top-[43.5%] left-[51%] -translate-x-1/2 animate-[pulse_2.8s_0.4s_infinite]">
              <SparkleIcon className="w-3.5 h-3.5 text-[#C9A24D] drop-shadow-[0_0_6px_rgba(201,162,77,0.9)]" />
            </div>

            {/* Bottom-right gold heart clip glint */}
            <div className="absolute bottom-[14%] right-[19%] animate-[pulse_2.5s_1.2s_infinite]">
              <SparkleIcon className="w-3 h-3 text-[#E9D08F] drop-shadow-[0_0_5px_rgba(233,208,143,0.9)]" />
            </div>
          </div>

          {/* 3. Small Animated Butterflies in the margins only (never over card text) */}
          <div className="absolute -left-3 top-[18%] pointer-events-none z-20 animate-[softFloat_4s_infinite_ease-in-out]">
            <ButterflySVG size={32} variant="blush" />
          </div>

          <div className="absolute -right-3 bottom-[26%] pointer-events-none z-20 animate-[softFloat_4.5s_1s_infinite_ease-in-out]">
            <ButterflySVG size={34} variant="monarch" />
          </div>
        </div>
      </div>

      {/* BELOW CARD: CTA Button (NO extra text or paragraphs) */}
      <footer className="w-full flex flex-col items-center pb-2 z-20">
        <button
          onClick={handleOpenSurprise}
          className="relative group overflow-hidden w-full max-w-[320px] h-14 rounded-full bg-gradient-to-r from-[#F5E5B8] via-[#C9A24D] to-[#9C7424] text-[#3B2A25] font-['Jost'] font-bold text-[14px] uppercase tracking-[0.14em] shadow-[0_8px_25px_rgba(201,162,77,0.38)] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
        >
          {/* Button Sheen Sweep */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-sheen pointer-events-none"
            aria-hidden="true"
          />
          <span className="relative z-10 flex items-center gap-2">
            OPEN YOUR SURPRISE ✨
          </span>
        </button>
      </footer>
    </section>
  );
};

import React from 'react';
import { CrownIcon, DownArrowIcon, ButterflySVG, SparkleIcon } from './SVGIcons';

export const WishesSection: React.FC = () => {
  const scrollToCake = () => {
    const el = document.getElementById('cake-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCover = () => {
    const el = document.getElementById('cover-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="wishes-section"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between py-12 px-5 max-w-[480px] mx-auto overflow-hidden"
    >
      {/* Subtle Background Floating Butterflies in Margins */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] -left-3 opacity-45 animate-[softFloat_5s_infinite]">
          <ButterflySVG size={32} variant="blush" />
        </div>
        <div className="absolute top-[42%] -right-3 opacity-45 animate-[softFloat_6s_1.2s_infinite]">
          <ButterflySVG size={34} variant="monarch" />
        </div>
        <div className="absolute bottom-[22%] -left-2 opacity-40 animate-[softFloat_5.5s_0.6s_infinite]">
          <ButterflySVG size={28} variant="blush" />
        </div>
      </div>

      {/* SECTION HEADER: Replaced with "A SPECIAL BIRTHDAY WISH FOR YOU" */}
      <header className="w-full text-center flex flex-col items-center z-10 mb-8 pt-2">
        <span className="font-['Jost'] text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#9C7424] font-semibold mb-1">
          A SPECIAL BIRTHDAY WISH FOR YOU
        </span>
        <h2 className="font-['Great_Vibes'] text-[48px] sm:text-[54px] leading-[1.1] gold-3d-text animate-gold-pulse">
          Dear Riya,
        </h2>
      </header>

      {/* WISHES WRITTEN DIRECTLY ON BACKGROUND (NO BOXES OR CARDS) */}
      <div className="w-full flex flex-col items-center text-center z-10 space-y-7">
        
        {/* PART 1: PERSONAL WISHES FROM COUSIN / FAMILY */}
        <div className="w-full space-y-6">
          {/* Wish Line 1 */}
          <div className="relative px-2">
            <p className="font-['Cormorant_Garamond'] text-[20px] sm:text-[22px] leading-[1.65] font-medium embossed-text-3d">
              Wishing you a day filled with{' '}
              <span className="gold-3d-text font-bold">happiness</span>,{' '}
              <span className="gold-3d-text font-bold">love</span> and all the little moments that make life beautiful.
            </p>
          </div>

          {/* Delicate Accent Glint */}
          <div className="flex items-center justify-center gap-2 opacity-60" aria-hidden="true">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C9A24D]" />
            <SparkleIcon className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C9A24D]" />
          </div>

          {/* Wish Line 2 */}
          <div className="relative px-2">
            <p className="font-['Cormorant_Garamond'] text-[20px] sm:text-[22px] leading-[1.65] font-medium embossed-text-3d">
              May every new day bring you wonderful{' '}
              <span className="gold-3d-text font-bold">opportunities</span>,{' '}
              <span className="gold-3d-text font-bold">success</span> and moments that make your life more beautiful.
            </p>
          </div>

          {/* Delicate Accent Glint */}
          <div className="flex items-center justify-center gap-2 opacity-60" aria-hidden="true">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C9A24D]" />
            <SparkleIcon className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C9A24D]" />
          </div>

          {/* Wish Line 3 */}
          <div className="relative px-2">
            <p className="font-['Cormorant_Garamond'] text-[20px] sm:text-[22px] leading-[1.65] font-medium embossed-text-3d">
              Keep <span className="gold-3d-text font-bold">smiling</span>, keep{' '}
              <span className="gold-3d-text font-bold">growing</span> and keep{' '}
              <span className="gold-3d-text font-bold">shining ✨</span>
            </p>
          </div>

          {/* Finale Line */}
          <div className="pt-2">
            <p className="font-['Great_Vibes'] text-[36px] sm:text-[42px] leading-[1.2] gold-3d-title">
              Wishing you a truly wonderful birthday!
            </p>
          </div>
        </div>

        {/* ORNATE ROYAL GOLDEN DIVIDER */}
        <div className="flex items-center justify-center gap-3 my-4 w-full" aria-hidden="true">
          <div className="flex-1 max-w-[80px] h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A24D]/50 to-[#9C7424]" />
          <CrownIcon className="w-6 h-6 text-[#C9A24D] drop-shadow-[0_2px_4px_rgba(201,162,77,0.45)]" />
          <div className="flex-1 max-w-[80px] h-[1.5px] bg-gradient-to-l from-transparent via-[#C9A24D]/50 to-[#9C7424]" />
        </div>

        {/* PART 2: GOD'S BLESSINGS FOR RIYA (Directly over background, 3D Typography) */}
        <div className="w-full flex flex-col items-center pt-1">
          <span className="font-['Jost'] text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#9C7424] font-semibold mb-1">
            SPIRITUAL PRAYER & GRACE
          </span>
          <h3 className="font-['Cormorant_Garamond'] font-bold text-[30px] sm:text-[34px] gold-3d-title mb-3">
            God's Blessings
          </h3>
          <p className="font-['Cormorant_Garamond'] text-[19px] sm:text-[21px] leading-[1.7] font-medium embossed-text-3d max-w-[420px]">
            May God bless you with <span className="gold-3d-text font-bold">happiness</span>,{' '}
            <span className="gold-3d-text font-bold">good health</span>,{' '}
            <span className="gold-3d-text font-bold">peace</span> and{' '}
            <span className="gold-3d-text font-bold">success</span>. May He guide you through every journey, protect you from difficulties and fill your life with{' '}
            <span className="gold-3d-text font-bold">endless positivity</span>.
          </p>
        </div>

      </div>

      {/* BOTTOM ACTIONS */}
      <footer className="w-full flex flex-col items-center pt-10 z-10 gap-3">
        <button
          onClick={scrollToCake}
          className="relative group overflow-hidden w-full max-w-[320px] h-14 rounded-full bg-gradient-to-r from-[#F5E5B8] via-[#C9A24D] to-[#9C7424] text-[#3B2A25] font-['Jost'] font-bold text-[14px] uppercase tracking-[0.14em] shadow-[0_8px_25px_rgba(201,162,77,0.38)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-sheen pointer-events-none"
            aria-hidden="true"
          />
          <span>Continue to the cake</span>
          <DownArrowIcon className="w-4 h-4 text-[#3B2A25]" />
        </button>

        <button
          onClick={scrollToCover}
          className="text-[12px] font-['Jost'] text-[#9C7424] uppercase tracking-[0.18em] hover:text-[#C9A24D] transition-colors py-1 focus:outline-none cursor-pointer"
        >
          ↑ Back to cover
        </button>
      </footer>
    </section>
  );
};

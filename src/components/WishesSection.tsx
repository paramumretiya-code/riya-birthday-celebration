import React from 'react';
import { CrownIcon, DownArrowIcon, HeartIcon, ButterflySVG } from './SVGIcons';

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
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between py-10 px-4 max-w-[480px] mx-auto overflow-hidden"
    >
      {/* Subtle Background Butterflies (Behind content, z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[12%] -left-2 opacity-50 animate-[softFloat_5s_infinite]">
          <ButterflySVG size={28} variant="blush" />
        </div>
        <div className="absolute top-[48%] -right-2 opacity-50 animate-[softFloat_6s_1s_infinite]">
          <ButterflySVG size={30} variant="monarch" />
        </div>
      </div>

      {/* SECTION HEADER */}
      <header className="w-full text-center flex flex-col items-center z-10 mb-6">
        <span className="font-['Jost'] text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#9C7424] font-medium mb-1">
          With All My Love
        </span>
        <h2 className="font-['Great_Vibes'] text-[46px] sm:text-[52px] leading-[1.1] gold-text">
          Dear Riya,
        </h2>
      </header>

      {/* WISHES DECKLED PAPER CARDS */}
      <div className="w-full flex flex-col gap-4 z-10">
        
        {/* Card 1 */}
        <article className="deckle-card p-5 sm:p-6 text-center transform -rotate-0.5 transition-transform hover:rotate-0">
          <div className="flex justify-center mb-2">
            <HeartIcon className="w-3.5 h-3.5 text-[#C9A24D]" />
          </div>
          <p className="font-['Cormorant_Garamond'] text-[18px] sm:text-[19px] leading-[1.6] text-[#3B2A25] font-medium">
            Wishing you a day filled with happiness, love and all the little moments that make life beautiful.
          </p>
        </article>

        {/* Card 2 */}
        <article className="deckle-card p-5 sm:p-6 text-center transform rotate-0.5 transition-transform hover:rotate-0">
          <div className="flex justify-center mb-2">
            <HeartIcon className="w-3.5 h-3.5 text-[#C9A24D]" />
          </div>
          <p className="font-['Cormorant_Garamond'] text-[18px] sm:text-[19px] leading-[1.6] text-[#3B2A25] font-medium">
            May every new day bring you wonderful opportunities, success and moments that make your life more beautiful.
          </p>
        </article>

        {/* Card 3 */}
        <article className="deckle-card p-5 sm:p-6 text-center transform -rotate-0.5 transition-transform hover:rotate-0">
          <div className="flex justify-center mb-2">
            <HeartIcon className="w-3.5 h-3.5 text-[#C9A24D]" />
          </div>
          <p className="font-['Cormorant_Garamond'] text-[18px] sm:text-[19px] leading-[1.6] text-[#3B2A25] font-medium">
            Keep smiling, keep growing and keep shining.
          </p>
        </article>

        {/* Finale Line */}
        <div className="py-2 text-center">
          <p className="font-['Great_Vibes'] text-[34px] sm:text-[38px] leading-[1.2] text-[#B28B36] drop-shadow-sm">
            Wishing you a truly wonderful birthday!
          </p>
        </div>

        {/* Divider: gold hairline + SVG crown */}
        <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C9A24D]/60" />
          <CrownIcon className="w-5 h-5 text-[#C9A24D]" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C9A24D]/60" />
        </div>

        {/* God's Blessings Card */}
        <article className="deckle-card p-6 text-center shadow-[0_14px_40px_rgba(92,58,48,0.14)]">
          <span className="font-['Jost'] text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#9C7424] font-semibold block mb-1">
            Spiritual Prayer & Grace
          </span>
          <h3 className="font-['Cormorant_Garamond'] font-semibold text-[26px] sm:text-[28px] gold-text mb-3">
            God's Blessings
          </h3>
          <p className="font-['Cormorant_Garamond'] text-[18px] sm:text-[19px] leading-[1.65] text-[#3B2A25] font-medium">
            May God bless you with happiness, good health, peace and success. May He guide you through every journey, protect you from difficulties and fill your life with endless positivity.
          </p>
        </article>

      </div>

      {/* BOTTOM ACTIONS */}
      <footer className="w-full flex flex-col items-center pt-8 z-10 gap-3">
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


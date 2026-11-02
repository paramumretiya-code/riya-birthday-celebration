import React, { Suspense, useEffect, useState } from 'react';
import { AudioController } from './components/AudioController';
import { NavIndicator } from './components/NavIndicator';
import { CoverSection } from './components/CoverSection';
import { WishesSection } from './components/WishesSection';
import { HeartIcon } from './components/SVGIcons';

// Code-split Cake section to optimize initial mobile bundle & parse time
const CakeSection = React.lazy(() =>
  import('./components/CakeSection').then((m) => ({ default: m.CakeSection }))
);

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  // Soft cream loading screen until hero cover card is decoded
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.src = './assets/card.webp';

    const finish = () => {
      if (active) setIsReady(true);
    };

    if (img.complete) {
      // Small tick for smooth transition
      setTimeout(finish, 150);
    } else {
      img.onload = finish;
      img.onerror = finish;
    }

    // Safety timeout: Never keep the user waiting more than 1.6s even on 2G/3G
    const timer = setTimeout(finish, 1600);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F7EDE0] via-[#FDF5ED] to-[#F5E4D7] text-[#3B2A25] overflow-x-clip paper-noise selection:bg-[#F4CFC6] selection:text-[#3B2A25]">
      {/* Soft Luxury Cream Loading Screen for Slow 4G Resilience */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7EDE0] transition-opacity duration-600 pointer-events-none ${
          isReady ? 'opacity-0' : 'opacity-100 pointer-events-auto'
        }`}
        aria-hidden={isReady}
      >
        <div className="w-12 h-12 text-[#C9A24D] animate-[pulse_1.2s_infinite]">
          <HeartIcon className="w-full h-full drop-shadow-[0_2px_10px_rgba(201,162,77,0.35)]" />
        </div>
        <span className="font-['Jost'] text-[11px] uppercase tracking-[0.28em] text-[#9C7424] font-medium mt-4">
          Preparing Celebration ✨
        </span>
      </div>

      {/* Floating Audio Controller (Glass Circle Top-Right, Safe Insets) */}
      <AudioController />

      {/* Slim 3-Dot Progress Nav on Right */}
      <NavIndicator />

      {/* Continuous Centered Column (Mobile-first max 480px) */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* SECTION 1: COVER (ONLY "HAPPY BIRTHDAY RIYA" + Card Visual + Surprise CTA) */}
        <CoverSection />

        {/* SECTION 2: WISHES (NO boxes/cards, 3D Gold Typography directly on background) */}
        <WishesSection />

        {/* SECTION 3: CAKE (Code-split with Suspense fallback) */}
        <Suspense
          fallback={
            <div className="min-h-[100svh] w-full flex items-center justify-center text-[#9C7424] font-['Jost'] text-xs tracking-widest uppercase">
              Loading sweet celebration...
            </div>
          }
        >
          <CakeSection />
        </Suspense>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { AudioController } from './components/AudioController';
import { NavIndicator } from './components/NavIndicator';
import { PetalsCanvas } from './components/PetalsCanvas';
import { CoverSection } from './components/CoverSection';
import { WishesSection } from './components/WishesSection';
import { CakeSection } from './components/CakeSection';

const App: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F7EDE0] via-[#FDF5ED] to-[#F5E4D7] text-[#3B2A25] overflow-x-hidden paper-noise selection:bg-[#F4CFC6] selection:text-[#3B2A25]">
      {/* 1. Background Falling Elements Layer (Petals, Stars, Sparkles behind content) */}
      <PetalsCanvas layer="back" />

      {/* 2. Floating Audio Controller (Glass Circle Top-Right) */}
      <AudioController />

      {/* 3. Slim 3-Dot Progress Nav on Right */}
      <NavIndicator />

      {/* 4. Continuous Centered Column (Mobile-first max 480px) */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* SECTION 1: COVER (ONLY "HAPPY BIRTHDAY RIYA" + Card Visual + Surprise CTA) */}
        <CoverSection />

        {/* SECTION 2: WISHES (NO boxes/cards, 3D Gold Typography directly on background) */}
        <WishesSection />

        {/* SECTION 3: CAKE (Cake Photo + Interactive Wish Celebration) */}
        <CakeSection />
      </main>

      {/* 5. Foreground Falling Elements Layer (Petals, Stars, Sparkles gently drifting over content) */}
      <PetalsCanvas layer="front" />
    </div>
  );
};

export default App;

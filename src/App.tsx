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
      {/* Background Falling Petals & Twinkles Canvas */}
      <PetalsCanvas />

      {/* Floating Audio Controller (Glass Circle Top-Right) */}
      <AudioController />

      {/* Slim 3-Dot Progress Nav on Right */}
      <NavIndicator />

      {/* Continuous Centered Column (Mobile-first max 480px) */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* SECTION 1: COVER (matches card.jpg) */}
        <CoverSection />

        {/* SECTION 2: WISHES (paper-card aesthetic, NO boxes/cards in previous ugly style) */}
        <WishesSection />

        {/* SECTION 3: CAKE (matches cake.jpg SAME TO SAME) */}
        <CakeSection />
      </main>
    </div>
  );
};

export default App;


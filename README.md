# Riya's Birthday Celebration 🌸✨
A bespoke, luxury, mobile-first birthday celebration website dedicated to **Riya**.

Live Production Site: **[https://riya-birthday-celebration.vercel.app/](https://riya-birthday-celebration.vercel.app/)**

---

## 🌟 Visual Identity & Design
Built to match the exact uploaded reference photographs and luxury aesthetic:
1. **Cover Page (`/public/assets/card.jpg` / `card.webp`)**:
   - Single main heading: **`HAPPY BIRTHDAY RIYA`** in premium 3D metallic gold typography.
   - Blush greeting card with peony, fluttering butterflies, baby's breath, wooden clip heart tag, and organza ribbon bow.
   - Animated layered effects: soft gold diagonal shimmer, twinkling gold glints on pearls/hearts, and fluttering SVG butterflies in margins.
   - Single-tap CTA `"OPEN YOUR SURPRISE ✨"` that unlocks the experience, plays background music with fade-in, and releases a gold + blush confetti burst.
2. **Wishes Page (Direct 3D Background Typography)**:
   - Heading: `"A SPECIAL BIRTHDAY WISH FOR YOU"`.
   - Written directly over the continuous warm parchment background (no rectangular boxes or cards).
   - High-contrast, easily readable 3D embossed typography with Cormorant Garamond serif and Great Vibes script.
   - Royal golden crown divider and God's Blessings spiritual prayer.
3. **Cake Page (`/public/assets/cake.jpg` / `cake.webp`)**:
   - Single-tier watercolor blush & ivory cake with gold foil sash, fairy lights, roses, and gold "Happy Birthday" calligraphy topper.
   - Subtle Ken Burns slow zoom (scale 1 -> 1.04).
   - Animated micro fairy light sparkles, candle flame flicker, and topper glow.
   - Interactive `"Tap to make a wish 🎂"` button with haptic feedback, celebratory confetti cannons, and floating balloons.

---

## 🌸 Falling Particles System (`FALL_CONFIG`)
Configured at the top of `src/components/PetalsCanvas.tsx`:

```ts
export const FALL_CONFIG = {
  mobile:  { petals: 18, flowers: 6, stars: 22 },
  desktop: { petals: 26, flowers: 9, stars: 34 },
};
```

### Features:
- **Particle Types**: Blush rose petals, tiny 5-petal blush blossoms (~14-22px), and 4-point gold/light-gold stars (~8-14px).
- **Section Weights**: Cover section uses 60% of the counts to keep the card artwork clean; Wishes and Cake sections use 100%.
- **Layering**: Always positioned behind content (`z-[1]`) with `pointer-events: none` so text and buttons are never blocked.
- **Hardware Acceleration**: Animates strictly `transform` and `opacity` using CSS keyframes with `will-change: transform`. No per-particle JavaScript loop.
- **Offscreen Pausing**: Each section uses an `IntersectionObserver` to pause animations when scrolled out of view, saving battery and GPU.
- **Low-end Device Detection**: Automatically drops particle counts by 40% if CPU cores <= 4 or RAM <= 2GB.
- **FPS Watchdog**: Monitors rendering frame rate; if average FPS < 45 for 2 consecutive seconds, drops count by 40%.
- **Accessibility**: Returns zero particles if `prefers-reduced-motion` is enabled.
- **Instant Population**: Staggered negative animation delays ensure particles are distributed across the screen immediately upon load.

---

## 📱 Mobile-First Optimizations
- **Dynamic Viewports**: Uses `min-h-[100svh]` with `100dvh` and `100vh` fallbacks to prevent address bar jumps on iOS Safari and Android Chrome.
- **Zero Horizontal Overflow**: `overflow-x: clip` applied at root; tested from 320px (iPhone SE) to 430px (iPhone Pro Max) and landscape orientations.
- **Fluid Typography**: `clamp()` applied to all headings and body text. Body text never falls below 17px.
- **Touch Responsiveness**: All buttons are >= 48px tall (56px) with >= 8px spacing, `-webkit-tap-highlight-color: transparent`, and `active:scale-[0.97]` press feedback.
- **Resilient Loading Screen**: Soft cream luxury splash with a pulsing gold heart until the hero card image is decoded.
- **Audio Autoplay & Life Cycle**: Unlocks on the first user interaction (`OPEN YOUR SURPRISE ✨`), pauses on background/lock-screen, and resumes gracefully.
- **Open Graph / Sharing**: Rich preview tags (`og:title`, `og:description`, `og:image`, `twitter:card`) with a 1200x630 card banner for WhatsApp and Instagram shares.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: CSS Keyframes + Framer Motion (zero heavy 3D libraries)
- **Effects**: Canvas-Confetti (worker enabled, reduced motion support)
- **Typography**: Great Vibes, Cormorant Garamond, Jost
- **Audio**: Official high-definition stream of *"BIRTHDAY WISH"* by HR71DP

---

## 🚀 Commands
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

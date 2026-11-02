# Riya's Birthday Celebration 🌸✨
A bespoke, luxury, mobile-first birthday celebration website created for **Riya**.

---

## 🌟 Visual Identity & Design
Built to match the exact uploaded reference photographs:
1. **Cover Page (`/public/assets/card.jpg` / `card.webp`)**:
   - Blush greeting card with peony, butterflies, baby's breath, wooden clip heart tag, and organza ribbon bow.
   - Animated layered effects: soft gold diagonal shimmer, twinkling gold glints on pearls/hearts, floating blush petals, and fluttering SVG butterflies in margins.
   - Single-tap CTA `"Open your surprise ✨"` that unlocks the experience, plays background music with fade-in, and releases a gold + blush confetti burst.
2. **Wishes Page (Paper-card Aesthetic)**:
   - Floating deckled paper cards with gold borders and delicate rotations.
   - High-contrast, easily readable ink typography (`#3B2A25`) with Cormorant Garamond serif and Great Vibes script.
   - God's Blessings card with spiritual grace prayer.
3. **Cake Page (`/public/assets/cake.jpg` / `cake.webp`)**:
   - Single-tier watercolor blush & ivory cake with gold foil sash, fairy lights, roses, and gold "Happy Birthday" calligraphy topper.
   - Subtle Ken Burns slow zoom (scale 1 -> 1.04).
   - Animated micro fairy light sparkles, candle flame flicker, and topper glow.
   - Interactive `"Tap to make a wish 🎂"` button with haptic feedback, celebratory confetti cannons, and floating balloons.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: CSS Keyframes + Framer Motion (zero Three.js or heavy libraries for ultra-fast mobile loading and 60fps performance)
- **Effects**: Canvas-Confetti
- **Typography**: Great Vibes, Cormorant Garamond, Jost

---

## 🚀 Development & Build

### Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

---

## 🎨 How to Customize

### 1. Changing the Recipient's Name
- Open `src/components/CoverSection.tsx` and change `"Riya"` in `<h1>`.
- Open `src/components/WishesSection.tsx` and change `"Dear Riya,"`.
- Open `src/components/CakeSection.tsx` and change `"Make a wish, Riya"`.

### 2. Changing the Messages & Wishes
- Edit the text inside the deckled paper cards in `src/components/WishesSection.tsx`.

### 3. Updating Photos
- Replace `/public/assets/card.jpg` (Cover photo) and `/public/assets/cake.jpg` (Cake photo).
- Run image conversion to webp or update with matching `.webp` files in `/public/assets/`.

### 4. Changing Background Music
- Place your audio file at `/public/assets/music.mp3`.
- If the file is missing, the floating music button hides gracefully.

### 5. Deploying to Vercel
Push your changes to the `main` branch on GitHub:
```bash
git add .
git commit -m "Update celebration details"
git push origin main
```
Vercel automatically detects the commit and deploys to production.

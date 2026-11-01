# RIYA — A DAY TO REMEMBER ❤️
### Premium Continuous Long-Scrolling 3D Birthday Celebration Website

A bespoke, luxury interactive birthday celebration website built with love for **RIYA**.

---

## 🌟 Highlights & Features

### 🌸 Section 1: Grand Birthday Welcome
- **Visual Reference Accuracy**: Reproduces the uploaded reference invitation layout with high precision.
- **Ivory & Gold Elegance**: Features pink roses, delicate white florals, golden ribbons, champagne and blush balloons, and gold sparkle stars.
- **Personalization**: Beautifully personalized with `"HAPPY BIRTHDAY RIYA ❤️"` in sparkling gold foil typography with pulsing ruby heart and elegant subtitle `"A DAY TO REMEMBER • FOREVER SPECIAL"`.
- **3D Depth & Motion**: Interactive mouse parallax tilt effect with floating 3D layered balloons, swaying golden ribbons, and ambient twinkling canvas particle stardust.
- **Smooth Transition**: A shimmering gold `"LET'S CELEBRATE ✨"` button starts the background music and smoothly scrolls down to Section 2.
- **Scroll Prompt**: Subtle `"Scroll to Explore ↓"` prompt at the bottom of the section.

### 💌 Section 2: Birthday Wishes & God's Blessings
- **Emotional & Luxurious**: Warm cream and blush palette with gold foil accents and botanical corner filigree.
- **Card 1 ("A Little Wish From Me")**: Sisterly personal letter expressing deep gratitude, love, and wishes for unending happiness.
- **Card 2 ("May God Bless You ✨")**: Spiritual prayer for protection, good health, peace, guidance, and endless success.
- **Interactive Details**: Floating luxury cards with wax seals, glowing drop-shadows, and 3D hover effects.
- **Navigation Controls**: `"↑ WELCOME"` (scrolls back to top) and `"NEXT SURPRISE 🎂 ↓"` (scrolls to Section 3) with smooth scrolling.

### 🎂 Section 3: The Magical 3D Pink Cake Celebration
- **Interactive Three.js 3D Pink Cake**: A realistic 3-tier pink fondant cake with gold and pearlescent cream piping trims, edible gold leaf accents, and an ornate champagne gold pedestal stand.
- **Lit Candles & Flickering Flames**: Spiral-striped birthday candles with animated flickering flame shaders and warm candle point lights (ignites sequentially upon scrolling into view).
- **True Cake Cutting Interaction**:
  - Clicking `"CUT THE CAKE 🎂"` brings in an animated golden cake knife that descends and slices through all three tiers.
  - A real 3D wedge slice separates and glides smoothly forward onto a gold-rimmed dessert plate.
  - Triggers a full-screen multi-color confetti cannon celebration (champagne gold, blush pink, rose gold, and metallic foil).
  - Displays the heartfelt message: *"Happy Birthday, RIYA! ❤️ May your life always be as sweet as this cake!"*
- **Replay Feature**: `"CELEBRATE AGAIN ✨"` button seamlessly resets the cake and relights the candles for another celebration.
- **360° Inspection**: Drag with mouse or finger to rotate the cake from any angle.
- **Robust CSS Fallback**: Automatic graceful fallback for environments without WebGL hardware acceleration.

### 🎵 Dedicated Background Birthday Music
- Uses the uploaded audio file: `assets/music/happy-birthday.mp3` (`nastelbom-happy-birthday-495860.mp3`).
- Initiates smooth playback on first interaction (`"LET'S CELEBRATE ✨"` button or manual audio toggle).
- Plays seamlessly and continuously without interruption while scrolling between all 3 sections.
- Music toggle button in the fixed header with animated live equalizer bars and `MUSIC ON` / `MUSIC OFF` status pill.
- Custom Web Audio API sound effects for button chimes, candle ignition, knife slice swooshes, and celebratory fanfares.

---

## 🚀 Running the Project

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
Open [http://localhost:5173/](http://localhost:5173/) in any modern browser.

---

## 📁 Project Structure

```
├── index.html                   # Continuous vertical long-scrolling page with 3 sections
├── package.json                 # Project configuration and dependencies (three, canvas-confetti, gsap)
├── vite.config.js               # Vite build and server settings
├── public/
│   ├── assets/
│   │   ├── reference_invitation.jpeg  # High-resolution reference floral invitation
│   │   └── music/
│   │       └── happy-birthday.mp3     # Uploaded background music (nastelbom-happy-birthday-495860.mp3)
│   └── fonts/
│       ├── fonts.css            # Self-hosted typography (Cinzel, Cormorant Garamond, Great Vibes, Montserrat)
│       └── *.ttf                # 100% offline font binaries
└── src/
    ├── styles/
    │   ├── variables.css        # Palette (#FFF9F5, #F8DAD8, #D6AD68), fonts & shadows
    │   ├── animations.css       # Keyframe animations (floating, shimmer, flame flicker)
    │   ├── main.css             # Long-scrolling layout, header stepper, audio button
    │   ├── page1.css            # Section 1 invitation card, 3D tilt, balloons
    │   ├── page2.css            # Section 2 wishes cards, floral filigree, badges
    │   └── page3.css            # Section 3 cake stage, celebration modal, buttons
    └── scripts/
        ├── main.js              # Scroll controller, smooth navigation, scroll reveals
        ├── audio.js             # Background music player & Web Audio API sound effects
        ├── particles.js         # Canvas particle system for ambient gold dust
        ├── cake3d.js            # Three.js 3D pink cake, knife & slice mechanics
        └── confetti.js          # Canvas-confetti celebration cannon
```

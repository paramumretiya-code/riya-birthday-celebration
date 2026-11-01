// Luxury Birthday Confetti Cannon
import confetti from 'canvas-confetti';

export function fireBirthdayConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#D6AD68', '#F8DAD8', '#E5A9A9', '#FFF3E8', '#FFD700', '#F3BAC3'],
    disableForReducedMotion: true
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Multi-stage fire sequence
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // Lateral cannons from bottom corners
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#D6AD68', '#F8DAD8', '#FFE0B2']
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#D6AD68', '#F8DAD8', '#FFE0B2']
    });
  }, 350);
}


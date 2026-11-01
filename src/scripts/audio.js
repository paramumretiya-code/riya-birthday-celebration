// Audio Manager using the user's uploaded background music:
// assets/music/happy-birthday.mp3 (nastelbom-happy-birthday-495860.mp3)
// Plus Web Audio API sound effects for interactive actions

class AudioManager {
  constructor() {
    this.music = null;
    this.isPlaying = false;
    this.audioCtx = null;
    this.listeners = [];

    this.initAudioElement();
  }

  initAudioElement() {
    if (typeof window === 'undefined') return;

    // Relative asset path ensures compatibility across Vercel, sub-paths, and local preview
    const base = import.meta.env?.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const musicUrl = `${cleanBase}assets/music/happy-birthday.mp3`;

    this.music = new Audio(musicUrl);
    this.music.loop = true;
    this.music.preload = 'auto';
    this.music.volume = 0.75;

    // Fallback if origin or subpath resolution requires alternative relative format
    this.music.addEventListener('error', () => {
      if (!this.music._retried) {
        this.music._retried = true;
        this.music.src = './assets/music/happy-birthday.mp3';
        this.music.load();
      }
    });

    this.music.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });

    this.music.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.music.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying);
      } catch (e) {}
    });
  }

  async playMusic() {
    if (!this.music) this.initAudioElement();
    try {
      await this.music.play();
      this.isPlaying = true;
      this.notifyListeners();
      return true;
    } catch (err) {
      console.warn("Autoplay prevented by browser:", err);
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  pauseMusic() {
    if (this.music && !this.music.paused) {
      this.music.pause();
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  async toggleMusic() {
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      return await this.playMusic();
    }
  }

  // Web Audio Context for Sound Effects
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Button Click Chime
  playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [880, 1108.73, 1318.51].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.38);
      });
    } catch (e) {}
  }

  // Candle ignition spark
  playIgnite() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1700, now + 0.12);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Cake slicing swoosh
  playSliceSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Fanfare celebratory chime
  playCelebration() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.01, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.1);
      });
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();

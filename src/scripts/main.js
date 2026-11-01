// Main Application Controller — Long-Scrolling Birthday Celebration
import { ParticleSystem } from './particles.js';
import { audioManager } from './audio.js';
import { Cake3DScene } from './cake3d.js';
import { fireBirthdayConfetti } from './confetti.js';

class BirthdayCelebrationApp {
  constructor() {
    this.cakeScene = null;
    this.sections = [];
    this.stepItems = [];
    this.audioBtn = null;
    this.audioStatusLabel = null;
    this.cakeEntered = false;

    this.init();
  }

  init() {
    // 1. Initialize Ambient Particles
    new ParticleSystem('ambient-canvas');

    // 2. Setup 3D Pink Cake Scene
    this.setupCakeSection();

    // 3. Setup Music & Audio Controls
    this.setupAudio();

    // 4. Setup Section 1 Parallax Tilt
    this.setupPage1Tilt();

    // 5. Setup Smooth Scrolling Navigation & Stepper
    this.setupSmoothScrollNav();

    // 6. Setup Scroll-Triggered Reveal Animations
    this.setupScrollReveals();

    // Check URL parameters for direct section scrolling
    const urlParams = new URLSearchParams(window.location.search);
    const targetSection = urlParams.get('section');
    if (targetSection) {
      const sec = document.getElementById(targetSection + '-section') || document.getElementById(targetSection);
      if (sec) {
        window.scrollTo(0, sec.offsetTop);
      }
    }
  }

  setupAudio() {
    this.audioBtn = document.getElementById('btn-audio-toggle');
    this.audioStatusLabel = document.getElementById('audio-status-label') || document.querySelector('.audio-status-text');

    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', async () => {
        const isPlaying = await audioManager.toggleMusic();
        this.updateAudioUI(isPlaying);
      });
    }

    // Subscribe to audio state changes
    audioManager.onStateChange((isPlaying) => {
      this.updateAudioUI(isPlaying);
    });

    // "LET'S CELEBRATE ✨" button in Section 1
    const btnToWishes = document.getElementById('btn-to-wishes');
    if (btnToWishes) {
      btnToWishes.addEventListener('click', () => {
        audioManager.playChime();

        // Start background music on user action
        audioManager.playMusic();

        // Smoothly scroll down to Section 2 (Wishes)
        const wishesSection = document.getElementById('wishes-section');
        if (wishesSection) {
          wishesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Scroll Down Prompt Indicator
    const scrollDownPrompt = document.getElementById('scroll-down-prompt');
    if (scrollDownPrompt) {
      scrollDownPrompt.addEventListener('click', () => {
        audioManager.playChime();
        const wishesSection = document.getElementById('wishes-section');
        if (wishesSection) {
          wishesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  updateAudioUI(isPlaying) {
    if (!this.audioBtn) return;

    if (isPlaying) {
      this.audioBtn.classList.add('playing');
      this.audioBtn.title = "Pause Birthday Music";
      if (this.audioStatusLabel) this.audioStatusLabel.textContent = "MUSIC ON";
    } else {
      this.audioBtn.classList.remove('playing');
      this.audioBtn.title = "Play Birthday Music";
      if (this.audioStatusLabel) this.audioStatusLabel.textContent = "MUSIC OFF";
    }
  }

  setupSmoothScrollNav() {
    this.stepItems = document.querySelectorAll('.step-item');
    this.sections = [
      document.getElementById('welcome-section'),
      document.getElementById('wishes-section'),
      document.getElementById('cake-section'),
    ].filter(Boolean);

    // Stepper item clicks
    this.stepItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.dataset.target;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          audioManager.playChime();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Section 2 Buttons
    const btnWishesToWelcome = document.getElementById('btn-wishes-to-welcome');
    const btnWishesToCake = document.getElementById('btn-wishes-to-cake');

    if (btnWishesToWelcome) {
      btnWishesToWelcome.addEventListener('click', () => {
        audioManager.playChime();
        const welcome = document.getElementById('welcome-section');
        if (welcome) welcome.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (btnWishesToCake) {
      btnWishesToCake.addEventListener('click', () => {
        audioManager.playChime();
        const cake = document.getElementById('cake-section');
        if (cake) cake.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Section 3 Back Button
    const btnCakeToWishes = document.getElementById('btn-cake-to-wishes');
    if (btnCakeToWishes) {
      btnCakeToWishes.addEventListener('click', () => {
        audioManager.playChime();
        const wishes = document.getElementById('wishes-section');
        if (wishes) wishes.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Brand title click scrolls to top
    const navBrand = document.getElementById('nav-brand');
    if (navBrand) {
      navBrand.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ScrollSpy to update active stepper indicator
    const updateActiveNav = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      this.sections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.stepItems.forEach((item, itemIdx) => {
            if (itemIdx === idx) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });

          // Trigger cake candles when scrolling into Cake section
          if (idx === 2 && !this.cakeEntered) {
            this.cakeEntered = true;
            if (this.cakeScene) {
              setTimeout(() => {
                this.cakeScene.lightCandlesSequence();
              }, 400);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  setupScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const checkReveals = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 50 && rect.bottom > 50) {
          el.classList.add('is-revealed');
        }
      });
    };

    // Run check on initial mount
    checkReveals();
    requestAnimationFrame(checkReveals);
    setTimeout(checkReveals, 300);

    // Also run on scroll
    window.addEventListener('scroll', checkReveals, { passive: true });

    // IntersectionObserver for smooth entries
    if (window.IntersectionObserver) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, {
        root: null,
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px'
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  setupPage1Tilt() {
    const cardStage = document.querySelector('.invitation-card-stage');
    const page1 = document.getElementById('welcome-section');
    if (!cardStage || !page1) return;

    const balloons = document.querySelectorAll('.ambient-balloon');

    const handleMove = (x, y) => {
      const rect = page1.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (x - centerX) / (rect.width / 2);
      const percentY = (y - centerY) / (rect.height / 2);

      // Subtle 3D tilt
      const tiltX = -percentY * 6;
      const tiltY = percentX * 6;
      cardStage.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Subtle balloon shift
      balloons.forEach((b, i) => {
        const factor = (i + 1) * 5;
        b.style.transform = `translate(${percentX * factor}px, ${percentY * factor}px)`;
      });
    };

    page1.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    page1.addEventListener('mouseleave', () => {
      cardStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
      balloons.forEach((b) => {
        b.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  setupCakeSection() {
    this.cakeScene = new Cake3DScene('cake-stage-container');

    const btnCut = document.getElementById('btn-cut-cake');
    const btnCelebrateAgain = document.getElementById('btn-celebrate-again');
    const celebrationBox = document.getElementById('celebration-message-box');
    const wishPrompt = document.querySelector('.cake-wish-prompt');

    if (btnCut) {
      btnCut.addEventListener('click', () => {
        if (!this.cakeScene || this.cakeScene.isCutting || this.cakeScene.isCut) return;

        btnCut.disabled = true;
        btnCut.style.opacity = '0.5';

        // Trigger cake cutting animation
        this.cakeScene.cutTheCake(() => {
          // On cut complete:
          fireBirthdayConfetti();
          audioManager.playCelebration();

          if (celebrationBox) celebrationBox.classList.add('active');
          if (btnCut) btnCut.style.display = 'none';
          if (wishPrompt) wishPrompt.style.opacity = '0';
        });
      });
    }

    if (btnCelebrateAgain) {
      btnCelebrateAgain.addEventListener('click', () => {
        audioManager.playChime();
        if (celebrationBox) celebrationBox.classList.remove('active');
        if (btnCut) {
          btnCut.style.display = 'inline-flex';
          btnCut.disabled = false;
          btnCut.style.opacity = '1';
        }
        if (wishPrompt) wishPrompt.style.opacity = '1';
        if (this.cakeScene) {
          this.cakeScene.resetCelebration();
        }
        fireBirthdayConfetti();
      });
    }
  }
}

// Boot application
document.addEventListener('DOMContentLoaded', () => {
  new BirthdayCelebrationApp();
});

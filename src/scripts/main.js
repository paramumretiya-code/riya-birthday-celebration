// Main Application Controller — Riya's Royal 3D Birthday Celebration
import { ParticleSystem } from './particles.js';
import { ButterflySystem } from './butterflies.js';
import { audioManager } from './audio.js';
import { Cake3DScene } from './cake3d.js';
import { fireBirthdayConfetti } from './confetti.js';

class BirthdayCelebrationApp {
  constructor() {
    this.particleSystem = null;
    this.butterflySystem = null;
    this.cakeScene = null;
    this.sections = [];
    this.stepButtons = [];
    this.audioBtn = null;
    this.audioStatusLabel = null;
    this.cakeEntered = false;
    this.surpriseOpened = false;

    this.init();
  }

  init() {
    // 1. Initialize Continuous Ambient Particles, Petals & Bokeh
    this.particleSystem = new ParticleSystem('ambient-canvas');

    // 2. Initialize Realistic 3D Butterflies
    this.butterflySystem = new ButterflySystem('butterfly-container');

    // 3. Setup 3D Cake Scene in Three.js
    this.setupCakeSection();

    // 4. Setup Audio & Music System
    this.setupAudio();

    // 5. Setup Surprise Cover Opening Sequence
    this.setupSurpriseCover();

    // 6. Setup Mobile Stepper & Smooth Scrolling
    this.setupSmoothScrollNav();

    // 7. Setup Parallax 3D Card Tilt
    this.setupCardParallax();

    // 8. Setup Scroll-Triggered Reveal Animations
    this.setupScrollReveals();

    // Check URL parameters for direct section scrolling if specified
    const urlParams = new URLSearchParams(window.location.search);
    const targetSection = urlParams.get('section');
    if (targetSection) {
      const sec = document.getElementById(targetSection + '-section') || document.getElementById(targetSection);
      if (sec) {
        window.scrollTo(0, sec.offsetTop);
      }
    }
  }

  // Cover opening cinematic transition
  setupSurpriseCover() {
    const btnOpenSurprise = document.getElementById('btn-open-surprise');
    const surpriseCover = document.getElementById('surprise-cover');

    const openSurprise = async () => {
      if (this.surpriseOpened) return;
      this.surpriseOpened = true;

      // 1. Audio chime & start background birthday music immediately
      audioManager.playChime();
      await audioManager.playMusic();

      // 2. Cinematic transition classes
      document.body.classList.remove('surprise-closed');
      document.body.classList.add('surprise-opened');

      // 3. Trigger initial celebratory confetti burst
      setTimeout(() => {
        fireBirthdayConfetti();
      }, 700);
    };

    if (btnOpenSurprise) {
      btnOpenSurprise.addEventListener('click', openSurprise);
    }

    if (surpriseCover) {
      surpriseCover.addEventListener('click', (e) => {
        if (e.target === surpriseCover) {
          openSurprise();
        }
      });
    }
  }

  setupAudio() {
    this.audioBtn = document.getElementById('btn-audio-toggle');
    this.audioStatusLabel = document.getElementById('audio-status-label');

    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', async () => {
        const isPlaying = await audioManager.toggleMusic();
        this.updateAudioUI(isPlaying);
      });
    }

    audioManager.onStateChange((isPlaying) => {
      this.updateAudioUI(isPlaying);
    });

    // "READ YOUR WISHES 💌" button in Section 1
    const btnToWishes = document.getElementById('btn-to-wishes');
    if (btnToWishes) {
      btnToWishes.addEventListener('click', () => {
        audioManager.playChime();
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
    this.stepButtons = document.querySelectorAll('.step-dot-btn');
    this.sections = [
      document.getElementById('welcome-section'),
      document.getElementById('wishes-section'),
      document.getElementById('cake-section'),
    ].filter(Boolean);

    // Stepper item clicks
    this.stepButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          audioManager.playChime();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Section 2 Navigation Buttons
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

    // Brand logo click scrolls to top
    const navBrand = document.getElementById('nav-brand');
    if (navBrand) {
      navBrand.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ScrollSpy to update active stepper dot
    const updateActiveNav = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      this.sections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.stepButtons.forEach((btn, bIdx) => {
            if (bIdx === idx) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
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
        if (rect.top < windowHeight - 40 && rect.bottom > 40) {
          el.classList.add('is-revealed');
        }
      });
    };

    checkReveals();
    requestAnimationFrame(checkReveals);
    setTimeout(checkReveals, 300);

    window.addEventListener('scroll', checkReveals, { passive: true });

    if (window.IntersectionObserver) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px'
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  setupCardParallax() {
    const cardStage = document.getElementById('invitation-card-stage');
    const page1 = document.getElementById('welcome-section');
    if (!cardStage || !page1) return;

    const handleMove = (clientX, clientY) => {
      const rect = page1.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (clientX - centerX) / (rect.width / 2);
      const percentY = (clientY - centerY) / (rect.height / 2);

      const tiltX = -percentY * 5.5;
      const tiltY = percentX * 5.5;
      cardStage.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    page1.addEventListener('pointermove', (e) => {
      handleMove(e.clientX, e.clientY);
    }, { passive: true });

    page1.addEventListener('pointerleave', () => {
      cardStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
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
          // On cut completed:
          fireBirthdayConfetti();
          audioManager.playCelebration();

          // Trigger realistic celebration butterflies swarm
          if (this.butterflySystem) {
            this.butterflySystem.triggerCelebrationSwarm();
          }

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
        if (this.butterflySystem) {
          this.butterflySystem.triggerCelebrationSwarm();
        }
      });
    }
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BirthdayCelebrationApp();
});

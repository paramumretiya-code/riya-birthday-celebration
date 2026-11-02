// Realistic 3D Butterflies System matching cover_reference.jpg
// Includes Monarch-style pink butterfly, blush butterfly, perching, realistic wing-flutter and flight paths

export class ButterflySystem {
  constructor(containerId = 'butterfly-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = containerId;
      this.container.className = 'butterfly-container';
      document.body.appendChild(this.container);
    }
    this.butterflies = [];
    this.flyingButterflies = [];
    this.celebrationSwarm = [];
    this.rafId = null;

    this.init();
  }

  init() {
    // 1. Ambient Free-Flying Butterflies across the continuous atmosphere
    const flyingConfigs = [
      { id: 'fb1', type: 'flying', variant: 'monarch', x: -60, y: 160, scale: 0.8, speed: 1.1 },
      { id: 'fb2', type: 'hovering', variant: 'blush', x: window.innerWidth - 60, y: 180, scale: 0.72, speed: 0.8 },
      { id: 'fb3', type: 'flying', variant: 'blush', x: -50, y: 440, scale: 0.78, speed: 0.95 }
    ];

    flyingConfigs.forEach(cfg => {
      const b = this.createButterflyElement(cfg);
      this.flyingButterflies.push(b);
    });

    this.animate();
  }

  createButterflyElement(cfg) {
    const el = document.createElement('div');
    el.className = `butterfly butterfly-${cfg.variant} butterfly-${cfg.type}`;
    el.id = `butterfly-${cfg.id}`;

    // SVG Wings: Delicate veins and margins
    const isMonarch = cfg.variant === 'monarch';

    el.innerHTML = `
      <div class="butterfly-wings-wrapper">
        <div class="butterfly-wing butterfly-wing-left">
          <svg viewBox="0 0 60 70" class="wing-svg">
            <defs>
              <linearGradient id="wingGradL-${cfg.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE4D6"/>
                <stop offset="45%" stop-color="#F8B6C2"/>
                <stop offset="100%" stop-color="${isMonarch ? '#D97A88' : '#D6AD68'}"/>
              </linearGradient>
            </defs>
            <!-- Forewing -->
            <path d="M56,38 C56,12 40,2 20,4 C5,6 2,22 6,38 C10,52 24,66 46,62 C55,60 56,48 56,38 Z" 
                  fill="url(#wingGradL-${cfg.id})" 
                  stroke="${isMonarch ? '#2B1810' : '#D6AD68'}" 
                  stroke-width="${isMonarch ? '1.2' : '0.8'}"/>
            ${isMonarch ? `
              <!-- Monarch Black Margins & White Spots -->
              <path d="M20,4 C5,6 2,22 6,38 C10,52 24,66 46,62" fill="none" stroke="#2B1810" stroke-width="3"/>
              <path d="M56,38 C42,24 24,20 10,26 M56,38 C34,34 18,40 12,48 M56,38 C40,46 28,54 22,58" fill="none" stroke="#2B1810" stroke-width="1.2"/>
              <circle cx="12" cy="18" r="1.8" fill="#FFFFFF"/>
              <circle cx="22" cy="12" r="1.8" fill="#FFFFFF"/>
              <circle cx="8" cy="30" r="1.6" fill="#FFFFFF"/>
              <circle cx="14" cy="46" r="1.6" fill="#FFFFFF"/>
            ` : `
              <path d="M56,38 C42,24 24,20 10,26 M56,38 C34,34 18,40 12,48" fill="none" stroke="rgba(214, 173, 104, 0.7)" stroke-width="0.8"/>
              <circle cx="16" cy="18" r="2" fill="#FFF9F5" opacity="0.9"/>
            `}
          </svg>
        </div>
        <div class="butterfly-body">
          <div class="butterfly-head"></div>
        </div>
        <div class="butterfly-wing butterfly-wing-right">
          <svg viewBox="0 0 60 70" class="wing-svg">
            <defs>
              <linearGradient id="wingGradR-${cfg.id}" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFE4D6"/>
                <stop offset="45%" stop-color="#F8B6C2"/>
                <stop offset="100%" stop-color="${isMonarch ? '#D97A88' : '#D6AD68'}"/>
              </linearGradient>
            </defs>
            <path d="M4,38 C4,12 20,2 40,4 C55,6 58,22 54,38 C50,52 36,66 14,62 C5,60 4,48 4,38 Z" 
                  fill="url(#wingGradR-${cfg.id})" 
                  stroke="${isMonarch ? '#2B1810' : '#D6AD68'}" 
                  stroke-width="${isMonarch ? '1.2' : '0.8'}"/>
            ${isMonarch ? `
              <path d="M40,4 C55,6 58,22 54,38 C50,52 36,66 14,62" fill="none" stroke="#2B1810" stroke-width="3"/>
              <path d="M4,38 C18,24 36,20 50,26 M4,38 C26,34 42,40 48,48 M4,38 C20,46 32,54 38,58" fill="none" stroke="#2B1810" stroke-width="1.2"/>
              <circle cx="48" cy="18" r="1.8" fill="#FFFFFF"/>
              <circle cx="38" cy="12" r="1.8" fill="#FFFFFF"/>
              <circle cx="52" cy="30" r="1.6" fill="#FFFFFF"/>
              <circle cx="46" cy="46" r="1.6" fill="#FFFFFF"/>
            ` : `
              <path d="M4,38 C18,24 36,20 50,26 M4,38 C26,34 42,40 48,48" fill="none" stroke="rgba(214, 173, 104, 0.7)" stroke-width="0.8"/>
              <circle cx="44" cy="18" r="2" fill="#FFF9F5" opacity="0.9"/>
            `}
          </svg>
        </div>
      </div>
    `;

    this.container.appendChild(el);

    return {
      el,
      ...cfg,
      startX: cfg.x,
      startY: cfg.y,
      currentX: cfg.x,
      currentY: cfg.y,
      t: Math.random() * 100
    };
  }

  // Cover card butterflies take flight when "OPEN YOUR SURPRISE ✨" is clicked
  triggerCoverFlyAway() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Launch 3 butterflies soaring across from card positions
    const flyAwayConfigs = [
      // Monarch from bottom-right of card
      { id: `fly-monarch-${Date.now()}`, variant: 'monarch', startX: screenW * 0.7, startY: screenH * 0.6, vx: -2.8, vy: -3.2, scale: 0.95 },
      // Blush from top-left of card
      { id: `fly-blush-${Date.now()}`, variant: 'blush', startX: screenW * 0.25, startY: screenH * 0.28, vx: 2.6, vy: -2.8, scale: 0.85 },
      // Extra gold butterfly soaring upward
      { id: `fly-gold-${Date.now()}`, variant: 'blush', startX: screenW * 0.5, startY: screenH * 0.5, vx: 1.5, vy: -4.0, scale: 0.9 }
    ];

    flyAwayConfigs.forEach(cfg => {
      const b = this.createButterflyElement({
        id: cfg.id,
        type: 'flight-launch',
        variant: cfg.variant,
        x: cfg.startX,
        y: cfg.startY,
        scale: cfg.scale,
        speed: 1.5
      });
      b.vx = cfg.vx;
      b.vy = cfg.vy;
      b.life = 0;
      b.maxLife = 240;
      this.celebrationSwarm.push(b);
    });
  }

  // Cake cutting celebration swarm
  triggerCelebrationSwarm() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const swarmCount = 7;

    for (let i = 0; i < swarmCount; i++) {
      const id = `swarm-${Date.now()}-${i}`;
      const startX = screenW * 0.5 + (Math.random() - 0.5) * 70;
      const startY = screenH * 0.6 + (Math.random() - 0.5) * 50;
      const angle = (Math.PI / (swarmCount + 1)) * (i + 1) + (Math.random() - 0.5) * 0.35;
      const speed = 2.4 + Math.random() * 1.6;

      const b = this.createButterflyElement({
        id,
        type: 'swarm',
        variant: i % 2 === 0 ? 'monarch' : 'blush',
        x: startX,
        y: startY,
        scale: 0.75 + Math.random() * 0.3,
        speed
      });
      b.vx = Math.cos(angle) * speed * 1.3;
      b.vy = -Math.sin(angle) * speed * 1.7;
      b.life = 0;
      b.maxLife = 260;
      this.celebrationSwarm.push(b);
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // 1. Ambient Flying Butterflies
    this.flyingButterflies.forEach(b => {
      b.t += 0.016 * b.speed;

      if (b.type === 'flying') {
        b.currentX += 0.85 * b.speed;
        b.currentY += Math.sin(b.t * 2.2) * 1.5;
        const tilt = Math.cos(b.t * 2.2) * 14;

        if (b.currentX > screenW + 80) {
          b.currentX = -80;
          b.currentY = Math.random() * (screenH * 0.6) + 60;
        }

        b.el.style.transform = `translate3d(${b.currentX}px, ${b.currentY}px, 0) scale(${b.scale}) rotateZ(${tilt}deg)`;
      } else if (b.type === 'hovering') {
        const hoverX = b.startX + Math.sin(b.t * 1.6) * 16;
        const hoverY = b.startY + Math.cos(b.t * 2.0) * 12;
        const hoverTilt = Math.sin(b.t * 1.6) * 7;

        b.el.style.transform = `translate3d(${hoverX}px, ${hoverY}px, 0) scale(${b.scale}) rotateZ(${hoverTilt}deg)`;
      }
    });

    // 2. Swarm and Launch Butterflies
    for (let i = this.celebrationSwarm.length - 1; i >= 0; i--) {
      const sb = this.celebrationSwarm[i];
      sb.life++;

      sb.currentX += sb.vx;
      sb.currentY += sb.vy;
      sb.vy += 0.012;
      sb.vx += (Math.random() - 0.5) * 0.35;

      const angle = Math.atan2(sb.vy, sb.vx) * (180 / Math.PI) + 90;
      const opacity = sb.life > sb.maxLife - 40 ? (sb.maxLife - sb.life) / 40 : 1;

      sb.el.style.transform = `translate3d(${sb.currentX}px, ${sb.currentY}px, 0) scale(${sb.scale}) rotateZ(${angle}deg)`;
      sb.el.style.opacity = Math.max(0, opacity);

      if (sb.life >= sb.maxLife || sb.currentY < -100 || sb.currentX < -100 || sb.currentX > screenW + 100) {
        sb.el.remove();
        this.celebrationSwarm.splice(i, 1);
      }
    }
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.container) this.container.remove();
  }
}

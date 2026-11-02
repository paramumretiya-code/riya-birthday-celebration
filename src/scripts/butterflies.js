// Realistic 3D Butterflies System for Riya's Birthday Celebration

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
    this.celebrationSwarm = [];
    this.isCelebrating = false;
    this.rafId = null;

    this.init();
  }

  init() {
    // Create initial butterflies: some flying, some hovering near flowers
    const initialConfigs = [
      { id: 'b1', type: 'flying', color: 'rose-gold', x: -60, y: 180, scale: 0.85, speed: 1.2 },
      { id: 'b2', type: 'hovering', color: 'champagne', x: 40, y: 120, scale: 0.75, speed: 0.8 },
      { id: 'b3', type: 'flying', color: 'blush-pink', x: -40, y: 450, scale: 0.9, speed: 1.0 },
      { id: 'b4', type: 'hovering', color: 'rose-gold', x: window.innerWidth - 70, y: 220, scale: 0.7, speed: 0.7 }
    ];

    initialConfigs.forEach(cfg => {
      const b = this.createButterflyElement(cfg);
      this.butterflies.push(b);
    });

    this.animate();
  }

  createButterflyElement(cfg) {
    const el = document.createElement('div');
    el.className = `butterfly butterfly-${cfg.color} butterfly-${cfg.type}`;
    el.dataset.id = cfg.id;

    // SVG butterfly wings with delicate translucent veins and gold foil patterns
    el.innerHTML = `
      <div class="butterfly-wings-wrapper">
        <div class="butterfly-wing butterfly-wing-left">
          <svg viewBox="0 0 50 60" class="wing-svg">
            <defs>
              <linearGradient id="wingGrad-${cfg.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE4D6" stop-opacity="0.95"/>
                <stop offset="50%" stop-color="#F8BCC6" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#D6AD68" stop-opacity="0.85"/>
              </linearGradient>
            </defs>
            <path d="M48,32 C48,12 36,2 20,4 C6,6 2,18 4,32 C6,44 18,56 36,54 C46,52 48,42 48,32 Z" fill="url(#wingGrad-${cfg.id})" stroke="#D6AD68" stroke-width="0.8"/>
            <path d="M48,32 C36,22 22,20 10,26 M48,32 C32,32 18,36 12,44 M48,32 C38,40 28,48 24,52" fill="none" stroke="rgba(214, 173, 104, 0.6)" stroke-width="0.6"/>
            <circle cx="16" cy="18" r="2.5" fill="#FFF7ED" opacity="0.9"/>
            <circle cx="28" cy="14" r="1.8" fill="#FFF7ED" opacity="0.9"/>
          </svg>
        </div>
        <div class="butterfly-body">
          <div class="butterfly-head"></div>
          <div class="butterfly-antennae"></div>
        </div>
        <div class="butterfly-wing butterfly-wing-right">
          <svg viewBox="0 0 50 60" class="wing-svg">
            <defs>
              <linearGradient id="wingGradR-${cfg.id}" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFE4D6" stop-opacity="0.95"/>
                <stop offset="50%" stop-color="#F8BCC6" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#D6AD68" stop-opacity="0.85"/>
              </linearGradient>
            </defs>
            <path d="M2,32 C2,12 14,2 30,4 C44,6 48,18 46,32 C44,44 32,56 14,54 C4,52 2,42 2,32 Z" fill="url(#wingGradR-${cfg.id})" stroke="#D6AD68" stroke-width="0.8"/>
            <path d="M2,32 C14,22 28,20 40,26 M2,32 C18,32 32,36 38,44 M2,32 C12,40 22,48 26,52" fill="none" stroke="rgba(214, 173, 104, 0.6)" stroke-width="0.6"/>
            <circle cx="34" cy="18" r="2.5" fill="#FFF7ED" opacity="0.9"/>
            <circle cx="22" cy="14" r="1.8" fill="#FFF7ED" opacity="0.9"/>
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
      angle: 0,
      t: Math.random() * 100,
      wingSpeed: 0.16 + Math.random() * 0.06
    };
  }

  // Trigger celebration swarm of butterflies on cake cutting
  triggerCelebrationSwarm() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const swarmCount = 8;

    for (let i = 0; i < swarmCount; i++) {
      const id = `swarm-${Date.now()}-${i}`;
      const startX = screenW * 0.5 + (Math.random() - 0.5) * 80;
      const startY = screenH * 0.65 + (Math.random() - 0.5) * 60;
      const angle = (Math.PI / (swarmCount + 1)) * (i + 1) + (Math.random() - 0.5) * 0.3;
      const speed = 2.2 + Math.random() * 1.5;

      const cfg = {
        id,
        type: 'swarm',
        color: i % 2 === 0 ? 'rose-gold' : 'champagne',
        x: startX,
        y: startY,
        scale: 0.7 + Math.random() * 0.35,
        speed,
        vx: Math.cos(angle) * speed * 1.4,
        vy: -Math.sin(angle) * speed * 1.6,
        life: 0,
        maxLife: 260
      };

      const b = this.createButterflyElement(cfg);
      b.vx = cfg.vx;
      b.vy = cfg.vy;
      b.life = cfg.life;
      b.maxLife = cfg.maxLife;
      this.celebrationSwarm.push(b);
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // 1. Update ambient butterflies
    this.butterflies.forEach(b => {
      b.t += 0.015 * b.speed;

      if (b.type === 'flying') {
        // Natural curved flight across screen
        b.currentX += 0.8 * b.speed;
        b.currentY += Math.sin(b.t * 2) * 1.4;
        const tilt = Math.cos(b.t * 2) * 15;

        // Wrap around screen
        if (b.currentX > screenW + 80) {
          b.currentX = -80;
          b.currentY = Math.random() * (screenH * 0.7) + 50;
        }

        b.el.style.transform = `translate3d(${b.currentX}px, ${b.currentY}px, 0) scale(${b.scale}) rotateZ(${tilt}deg)`;
      } else if (b.type === 'hovering') {
        // Gentle oscillation hovering around floral decorations
        const hoverX = b.startX + Math.sin(b.t * 1.5) * 18;
        const hoverY = b.startY + Math.cos(b.t * 2) * 14;
        const hoverTilt = Math.sin(b.t * 1.5) * 8;

        b.el.style.transform = `translate3d(${hoverX}px, ${hoverY}px, 0) scale(${b.scale}) rotateZ(${hoverTilt}deg)`;
      }
    });

    // 2. Update celebration swarm
    for (let i = this.celebrationSwarm.length - 1; i >= 0; i--) {
      const sb = this.celebrationSwarm[i];
      sb.life++;

      sb.currentX += sb.vx;
      sb.currentY += sb.vy;
      sb.vy += 0.015; // subtle gravity curve
      sb.vx += (Math.random() - 0.5) * 0.4; // fluttering flutter

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

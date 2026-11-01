// Luxury Golden Particle & Sparkle Canvas System

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.isRunning = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    const count = window.innerWidth < 768 ? 40 : 80;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createParticle() {
    const isStar = Math.random() < 0.25;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: isStar ? (Math.random() * 4 + 3) : (Math.random() * 2.5 + 1),
      isStar: isStar,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.45 + 0.15),
      opacity: Math.random() * 0.8 + 0.2,
      opacitySpeed: (Math.random() * 0.02 + 0.008) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.65 ? 'gold' : 'rose', // Gold or rose tint
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update() {
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Twinkle opacity
      p.opacity += p.opacitySpeed;
      if (p.opacity > 1 || p.opacity < 0.15) {
        p.opacitySpeed = -p.opacitySpeed;
      }

      // Loop back when floating above screen
      if (p.y < -20) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 10;
      if (p.x > this.width + 20) p.x = -10;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

      const color = p.hue === 'gold' 
        ? 'rgba(235, 195, 120, ' 
        : 'rgba(242, 185, 180, ';

      if (p.isStar) {
        // Draw 4-point sparkle star
        this.ctx.fillStyle = color + p.opacity + ')';
        this.ctx.beginPath();
        const r = p.size;
        for (let i = 0; i < 4; i++) {
          this.ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          this.ctx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * (r * 0.25), Math.sin(((i + 0.5) * Math.PI) / 2) * (r * 0.25));
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Glow center
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Soft golden orb with radial gradient
        const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.4, color + '0.7)');
        grad.addColorStop(1, color + '0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}


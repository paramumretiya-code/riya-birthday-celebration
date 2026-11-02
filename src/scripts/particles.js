// Luxury Continuous Ambient System: Golden Bokeh, Floating Rose Petals & Golden Sparkles

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.petals = [];
    this.bokehOrbs = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.tiltX = 0;
    this.tiltY = 0;
    this.isRunning = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Listen to touch/pointer or motion to gently deflect particles
    window.addEventListener('pointermove', (e) => {
      this.tiltX = (e.clientX / this.width - 0.5) * 2;
      this.tiltY = (e.clientY / this.height - 0.5) * 2;
    }, { passive: true });

    // Initialize Bokeh Orbs (soft glowing warm champagne and blush circles)
    const orbCount = 7;
    for (let i = 0; i < orbCount; i++) {
      this.bokehOrbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 80 + 60,
        color: i % 2 === 0 ? 'rgba(255, 228, 196, ' : 'rgba(248, 218, 216, ',
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.2,
        baseAlpha: Math.random() * 0.18 + 0.12,
        alphaOffset: Math.random() * Math.PI * 2
      });
    }

    // Initialize Golden Stardust & Stars
    const particleCount = window.innerWidth < 768 ? 45 : 75;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createSparkleParticle());
    }

    // Initialize Floating Rose Petals
    const petalCount = window.innerWidth < 768 ? 16 : 24;
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createRosePetal());
    }

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createSparkleParticle() {
    const isStar = Math.random() < 0.3;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: isStar ? (Math.random() * 3.5 + 2.5) : (Math.random() * 2 + 0.8),
      isStar,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -(Math.random() * 0.4 + 0.15),
      opacity: Math.random() * 0.8 + 0.2,
      opacitySpeed: (Math.random() * 0.02 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.7 ? 'gold' : 'rose',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.025
    };
  }

  createRosePetal() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * (this.height + 100) - 50,
      size: Math.random() * 10 + 12, // petal size
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.8 + 0.4, // gently falling down
      wobbleSpeed: Math.random() * 0.03 + 0.015,
      wobbleAngle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.03,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      rotSpeedZ: (Math.random() - 0.5) * 0.02,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.55,
      color1: '#F8CAD2', // soft blush pink
      color2: '#E89AA8'  // rose petal rim
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
    const time = performance.now() * 0.001;

    // 1. Update Bokeh Orbs
    this.bokehOrbs.forEach(orb => {
      orb.x += orb.speedX;
      orb.y += orb.speedY;

      // Wrap around bounds
      if (orb.x < -orb.radius) orb.x = this.width + orb.radius;
      if (orb.x > this.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = this.height + orb.radius;
      if (orb.y > this.height + orb.radius) orb.y = -orb.radius;
    });

    // 2. Update Sparkles
    for (const p of this.particles) {
      p.x += p.speedX + this.tiltX * 0.2;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      p.opacity += p.opacitySpeed;
      if (p.opacity > 0.95 || p.opacity < 0.15) {
        p.opacitySpeed = -p.opacitySpeed;
      }

      if (p.y < -20) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 10;
      if (p.x > this.width + 20) p.x = -10;
    }

    // 3. Update Floating Rose Petals
    for (const petal of this.petals) {
      petal.wobbleAngle += petal.wobbleSpeed;
      petal.x += Math.sin(petal.wobbleAngle) * 0.9 + petal.speedX + this.tiltX * 0.3;
      petal.y += petal.speedY;

      petal.rotX += petal.rotSpeedX;
      petal.rotY += petal.rotSpeedY;
      petal.rotation += petal.rotSpeedZ;

      if (petal.y > this.height + 40) {
        petal.y = -40;
        petal.x = Math.random() * this.width;
      }
      if (petal.x < -40) petal.x = this.width + 40;
      if (petal.x > this.width + 40) petal.x = -40;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = performance.now() * 0.001;

    // 1. Render Bokeh Orbs
    for (const orb of this.bokehOrbs) {
      const alpha = orb.baseAlpha + Math.sin(time + orb.alphaOffset) * 0.05;
      const grad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, orb.color + alpha + ')');
      grad.addColorStop(0.6, orb.color + (alpha * 0.4) + ')');
      grad.addColorStop(1, orb.color + '0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Render Sparkle Particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

      const color = p.hue === 'gold' 
        ? 'rgba(235, 195, 120, ' 
        : 'rgba(242, 185, 180, ';

      if (p.isStar) {
        this.ctx.fillStyle = color + p.opacity + ')';
        this.ctx.beginPath();
        const r = p.size;
        for (let i = 0; i < 4; i++) {
          this.ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          this.ctx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * (r * 0.28), Math.sin(((i + 0.5) * Math.PI) / 2) * (r * 0.28));
        }
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.5, color + '0.75)');
        grad.addColorStop(1, color + '0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    // 3. Render Floating Rose Petals with 3D Tumbling Effect
    for (const petal of this.petals) {
      this.ctx.save();
      this.ctx.translate(petal.x, petal.y);
      this.ctx.rotate(petal.rotation);

      // Simulate 3D tilt with cosine scale
      const scaleX = Math.cos(petal.rotX) * 0.7 + 0.3;
      const scaleY = Math.sin(petal.rotY) * 0.5 + 0.5;
      this.ctx.scale(scaleX, scaleY);
      this.ctx.globalAlpha = petal.opacity;

      // Organic curved rose petal shape
      const s = petal.size;
      const grad = this.ctx.createRadialGradient(-s * 0.15, -s * 0.2, s * 0.1, 0, 0, s);
      grad.addColorStop(0, '#FFF0F2');
      grad.addColorStop(0.4, petal.color1);
      grad.addColorStop(0.85, petal.color2);
      grad.addColorStop(1, 'rgba(195, 105, 120, 0.7)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -s * 0.7);
      this.ctx.bezierCurveTo(s * 0.75, -s * 0.7, s * 0.9, s * 0.25, 0, s * 0.85);
      this.ctx.bezierCurveTo(-s * 0.9, s * 0.25, -s * 0.75, -s * 0.7, 0, -s * 0.7);
      this.ctx.closePath();
      this.ctx.fill();

      // Subtle gold sparkle highlight on petal edge
      this.ctx.strokeStyle = 'rgba(255, 240, 220, 0.4)';
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}

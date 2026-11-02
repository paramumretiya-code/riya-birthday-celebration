import React, { useEffect, useRef } from 'react';

type ParticleType = 'pinkPetal' | 'whitePetal' | 'goldStar' | 'goldSparkle' | 'goldParticle';

interface Particle {
  type: ParticleType;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleAngle: number;
  rotation: number;
  rotSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  alphaSpeed: number;
  spikes?: number;
}

interface PetalsCanvasProps {
  layer?: 'back' | 'front';
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ layer = 'back' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const isFront = layer === 'front';

    // Particle distribution:
    // Back layer: 20 particles (subtle, background depth)
    // Front layer: 16 particles (crisp, foreground drift over cards & text)
    const count = isFront ? 16 : 20;
    const types: ParticleType[] = ['pinkPetal', 'whitePetal', 'goldStar', 'goldSparkle', 'goldParticle'];

    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const type = types[i % types.length];
      const baseSize = isFront ? 1.15 : 0.85;

      return {
        type,
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          type === 'pinkPetal'
            ? (Math.random() * 6 + 10) * baseSize
            : type === 'whitePetal'
            ? (Math.random() * 5 + 8) * baseSize
            : type === 'goldStar'
            ? (Math.random() * 4 + 7) * baseSize
            : type === 'goldSparkle'
            ? (Math.random() * 3 + 5) * baseSize
            : (Math.random() * 2 + 1.8) * baseSize,
        speedY: (Math.random() * 0.45 + (isFront ? 0.35 : 0.22)),
        speedX: (Math.random() - 0.5) * 0.25,
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        wobbleAngle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.015 + 0.008,
        opacity: isFront ? Math.random() * 0.35 + 0.6 : Math.random() * 0.25 + 0.3,
        alphaSpeed: (Math.random() * 0.01 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        spikes: Math.random() < 0.6 ? 4 : 5,
      };
    });

    let animId: number;
    let isPaused = false;

    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Helpers to draw geometric shapes
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    };

    const drawPetal = (size: number, isPink: boolean) => {
      const grad = ctx.createRadialGradient(0, -size * 0.2, 0, 0, 0, size);
      if (isPink) {
        grad.addColorStop(0, '#FFF5F2');
        grad.addColorStop(0.45, '#F4CFC6');
        grad.addColorStop(1, '#E3A3A0');
      } else {
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.5, '#FFF9F4');
        grad.addColorStop(1, '#EDE2D8');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.75, -size * 0.55, size * 0.8, size * 0.5, 0, size * 0.85);
      ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.75, -size * 0.55, 0, -size * 0.7);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      if (!isPaused) {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          // Physics update: continuous downward drift
          p.wobbleAngle += p.wobbleSpeed;
          p.x += Math.sin(p.wobbleAngle) * 0.65 + p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;
          p.tilt += p.tiltSpeed;

          // Sparkle twinkle
          if (p.type === 'goldSparkle' || p.type === 'goldStar') {
            p.opacity += p.alphaSpeed;
            const maxAlpha = isFront ? 0.95 : 0.65;
            const minAlpha = isFront ? 0.4 : 0.2;
            if (p.opacity > maxAlpha || p.opacity < minAlpha) {
              p.alphaSpeed = -p.alphaSpeed;
            }
          }

          // Recycling loop (seamless cross-section continuous fall)
          if (p.y > height + 30) {
            p.y = -30;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));

          if (p.type === 'pinkPetal' || p.type === 'whitePetal') {
            // 3D tumbling perspective scale
            ctx.scale(Math.cos(p.tilt) * 0.65 + 0.35, 1);
            drawPetal(p.size, p.type === 'pinkPetal');
          } else if (p.type === 'goldStar') {
            // Golden 4 or 5-point star
            const starGrad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
            starGrad.addColorStop(0, '#FFFCE8');
            starGrad.addColorStop(0.5, '#E9D08F');
            starGrad.addColorStop(1, '#C9A24D');
            ctx.fillStyle = starGrad;
            drawStar(0, 0, p.spikes || 4, p.size, p.size * 0.36);
            ctx.fill();
          } else if (p.type === 'goldSparkle') {
            // 4-point diamond sparkle
            ctx.fillStyle = '#FFEAA7';
            drawStar(0, 0, 4, p.size, p.size * 0.18);
            ctx.fill();
          } else {
            // Small gold dust particle
            ctx.fillStyle = '#F5DE98';
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [layer]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none w-full h-full ${
        layer === 'front' ? 'z-25' : 'z-1'
      }`}
      aria-hidden="true"
    />
  );
};

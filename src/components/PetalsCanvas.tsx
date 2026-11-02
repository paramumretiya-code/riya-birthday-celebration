import React, { useEffect, useRef } from 'react';

export const PetalsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
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

    // 12 subtle blush rose petals (capped <= 14)
    const petals = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 10,
      speedY: Math.random() * 0.45 + 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleAngle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      tilt: Math.random() * Math.PI,
      opacity: Math.random() * 0.35 + 0.35,
    }));

    // 18 tiny golden sparkles (capped <= 30)
    const sparkles = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      speedAlpha: (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
      speedY: -(Math.random() * 0.2 + 0.1),
    }));

    let animId: number;
    let isPaused = false;

    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isPaused) {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Sparkles
        sparkles.forEach((s) => {
          s.y += s.speedY;
          s.alpha += s.speedAlpha;
          if (s.alpha > 0.8 || s.alpha < 0.15) s.speedAlpha = -s.speedAlpha;
          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(233, 208, 143, ${Math.max(0, s.alpha)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. Draw Falling Rose Petals
        petals.forEach((p) => {
          p.wobbleAngle += p.wobbleSpeed;
          p.x += Math.sin(p.wobbleAngle) * 0.6 + p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;
          p.tilt += 0.01;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(Math.cos(p.tilt) * 0.6 + 0.4, 1);
          ctx.globalAlpha = p.opacity;

          // Petal Gradient
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, '#FFF5F2');
          grad.addColorStop(0.5, '#F4CFC6');
          grad.addColorStop(1, '#E3A3A0');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.6, p.size * 0.8, p.size * 0.5, 0, p.size * 0.8);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.75, -p.size * 0.6, 0, -p.size * 0.7);
          ctx.closePath();
          ctx.fill();

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      aria-hidden="true"
    />
  );
};


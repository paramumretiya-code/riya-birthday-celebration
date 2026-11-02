// Procedural Textures matching cake_reference.jpg
// Single-tier wide luxury cake with painted blush sash, edible gold foil & fairy lights
import * as THREE from 'three';

export function createLuxuryCakeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 1. Cream Ivory Buttercream Base
  ctx.fillStyle = '#FFFDF8';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle horizontal spatula strokes / frosting ridges
  for (let y = 0; y < 512; y += 4) {
    const alpha = Math.sin(y * 0.15) * 0.03 + 0.02;
    ctx.fillStyle = `rgba(235, 222, 210, ${alpha})`;
    ctx.fillRect(0, y, 1024, 3);
  }

  // 2. Diagonal Painted Watercolor Blush-Pink Sash (sweeping across cylinder)
  const drawSash = () => {
    ctx.save();
    ctx.beginPath();
    // Top border of sash
    ctx.moveTo(0, 320);
    ctx.bezierCurveTo(256, 290, 512, 250, 768, 280);
    ctx.bezierCurveTo(896, 295, 1024, 320, 1024, 320);

    // Bottom border of sash
    ctx.lineTo(1024, 450);
    ctx.bezierCurveTo(768, 410, 512, 380, 256, 420);
    ctx.lineTo(0, 450);
    ctx.closePath();

    // Watercolor pink gradient
    const pinkGrad = ctx.createLinearGradient(0, 250, 1024, 450);
    pinkGrad.addColorStop(0, '#FADCE2');
    pinkGrad.addColorStop(0.35, '#F7BCC8');
    pinkGrad.addColorStop(0.7, '#F3A9B8');
    pinkGrad.addColorStop(1, '#FADCE2');
    ctx.fillStyle = pinkGrad;
    ctx.fill();

    // Soft watercolor feathered texture inside the sash
    for (let i = 0; i < 600; i++) {
      const px = Math.random() * 1024;
      const py = 260 + Math.random() * 180;
      ctx.fillStyle = `rgba(242, 160, 175, ${Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 8 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
  drawSash();

  // 3. Edible Ragged Gold Foil Leaf Border & Micro Fairy Lights
  const drawGoldFoilBorder = (isTop) => {
    ctx.save();
    const pointCount = 200;
    for (let i = 0; i < pointCount; i++) {
      const x = (i / pointCount) * 1024;
      const baseY = isTop 
        ? (320 - Math.sin((i / pointCount) * Math.PI * 2) * 45)
        : (440 - Math.sin((i / pointCount) * Math.PI * 2) * 35);

      // Gold leaf flakes
      const flakeCount = Math.floor(Math.random() * 3 + 2);
      for (let f = 0; f < flakeCount; f++) {
        const fy = baseY + (Math.random() - 0.5) * 16;
        const fx = x + (Math.random() - 0.5) * 8;
        const size = Math.random() * 6 + 3;

        ctx.fillStyle = Math.random() < 0.6 ? '#E2B96B' : '#FFE89E';
        ctx.beginPath();
        ctx.ellipse(fx, fy, size, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      // Micro Fairy Light dot (sparkling warm light)
      if (i % 7 === 0) {
        const ly = baseY + (Math.random() - 0.5) * 8;
        // Outer glow
        const glow = ctx.createRadialGradient(x, ly, 0, x, ly, 10);
        glow.addColorStop(0, 'rgba(255, 250, 220, 0.95)');
        glow.addColorStop(0.3, 'rgba(255, 215, 130, 0.6)');
        glow.addColorStop(1, 'rgba(255, 215, 130, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, ly, 10, 0, Math.PI * 2);
        ctx.fill();

        // Bright center pin
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, ly, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  drawGoldFoilBorder(true);
  drawGoldFoilBorder(false);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Bump map for buttercream texture ridges
export function createButtercreamBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 256);

  // Horizontal spatula marks
  for (let y = 0; y < 256; y += 3) {
    const val = 128 + Math.sin(y * 0.2) * 25 + (Math.random() - 0.5) * 15;
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(0, y, 512, 2);
  }

  const bump = new THREE.CanvasTexture(canvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.ClampToEdgeWrapping;
  return bump;
}

// Three.js 3D Realistic Pink Birthday Cake Scene
import * as THREE from 'three';
import { audioManager } from './audio.js';

export class Cake3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || 500;
    this.height = this.container.clientHeight || 400;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cakeGroup = null;
    this.sliceGroup = null;
    this.plateGroup = null;
    this.knifeGroup = null;

    this.candles = [];
    this.flames = [];
    this.candleLights = [];

    this.isCut = false;
    this.isCutting = false;
    this.candlesLit = false;
    this.isDragging = false;
    this.isFallback = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVelocity = 0.004;

    this.init();
  }

  init() {
    try {
      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
      this.camera.position.set(0, 4.2, 11);
      this.camera.lookAt(0, 2.2, 0);

      // 3. Renderer
      const canvas = document.getElementById('cake-webgl-canvas');
      if (!canvas) return;

      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;

      // 4. Studio Lighting
      this.setupLighting();

      // 5. Build Cake Structure
      this.buildCake();

      // 6. Interactive Controls
      this.setupInteraction();

      // 7. Responsive Resize
      window.addEventListener('resize', () => this.onResize());

      // 8. Render Loop
      this.animate();
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      this.renderCSSFallback();
    }
  }

  renderCSSFallback() {
    this.isFallback = true;
    const stage = document.getElementById('cake-stage-container');
    if (!stage || stage.querySelector('.css-cake-fallback')) return;

    const fallback = document.createElement('div');
    fallback.className = 'css-cake-fallback';
    fallback.innerHTML = `
      <div class="css-cake-wrapper">
        <!-- Animated Knife for Fallback -->
        <div class="css-knife" aria-hidden="true">
          <div class="css-knife-blade"></div>
          <div class="css-knife-handle"></div>
        </div>

        <!-- 3 Cake Tiers -->
        <div class="css-cake-tier tier-top">
          <div class="css-candles-row">
            <div class="css-candle"><div class="css-flame"></div></div>
            <div class="css-candle"><div class="css-flame"></div></div>
            <div class="css-candle"><div class="css-flame"></div></div>
          </div>
          <div class="tier-frosting"></div>
        </div>
        <div class="css-cake-tier tier-middle">
          <div class="tier-frosting"></div>
        </div>
        <div class="css-cake-tier tier-bottom">
          <div class="tier-frosting"></div>
        </div>
        <div class="css-cake-stand">
          <div class="css-stand-top"></div>
          <div class="css-stand-pillar"></div>
          <div class="css-stand-base"></div>
        </div>

        <!-- Separated Dessert Slice & Plate -->
        <div class="css-dessert-plate" aria-hidden="true">
          <div class="css-plate-dish"></div>
          <div class="css-cake-slice">
            <div class="slice-inner"></div>
            <div class="slice-icing"></div>
          </div>
        </div>
      </div>
    `;
    stage.appendChild(fallback);
  }

  setupLighting() {
    // Ambient light with warm blush-gold tint
    const ambientLight = new THREE.AmbientLight(0xFFF0E5, 0.9);
    this.scene.add(ambientLight);

    // Key Light (Main soft shadow caster)
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Fill Light (Blush pink reflection)
    const fillLight = new THREE.DirectionalLight(0xF8DAD8, 0.7);
    fillLight.position.set(-8, 6, -4);
    this.scene.add(fillLight);

    // Gold Rim / Accent Light
    const rimLight = new THREE.DirectionalLight(0xD6AD68, 0.85);
    rimLight.position.set(0, -2, -8);
    this.scene.add(rimLight);
  }

  // Create layered sponge cake texture for the cut slice interior
  createLayeredCakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background pink vanilla sponge
    ctx.fillStyle = '#FCE3E7';
    ctx.fillRect(0, 0, 256, 256);

    // Cake layers (Sponge, Raspberry filling, Vanilla Cream)
    const layerColors = [
      '#F3BAC3', '#FFFFFF', '#D94D60', '#F3BAC3', 
      '#FFFFFF', '#D94D60', '#F3BAC3', '#FFFFFF'
    ];
    const layerH = 256 / layerColors.length;

    layerColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * layerH, 256, layerH);
      // Texture noise
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let i = 0; i < 300; i++) {
        ctx.fillRect(Math.random() * 256, idx * layerH + Math.random() * layerH, 2, 2);
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  buildCake() {
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.position.set(0, -0.6, 0);
    this.scene.add(this.cakeGroup);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.88,
      roughness: 0.22,
    });

    const tierPinkMaterial = new THREE.MeshStandardMaterial({
      color: 0xF8BCC6,
      roughness: 0.4,
      metalness: 0.05,
    });

    const creamPipingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFDF8,
      roughness: 0.35,
      metalness: 0.02,
    });

    const cutInteriorMaterial = new THREE.MeshStandardMaterial({
      map: this.createLayeredCakeTexture(),
      roughness: 0.6,
      metalness: 0.05,
    });

    // 1. Champagne Gold Cake Pedestal Stand
    const standGroup = new THREE.Group();

    // Stand base
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.28, 48);
    const baseMesh = new THREE.Mesh(baseGeo, goldMaterial);
    baseMesh.position.y = 0.14;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    standGroup.add(baseMesh);

    // Stand stem
    const stemGeo = new THREE.CylinderGeometry(0.55, 0.95, 1.2, 32);
    const stemMesh = new THREE.Mesh(stemGeo, goldMaterial);
    stemMesh.position.y = 0.88;
    stemMesh.castShadow = true;
    standGroup.add(stemMesh);

    // Stand platter
    const platterGeo = new THREE.CylinderGeometry(3.2, 3.0, 0.2, 48);
    const platterMesh = new THREE.Mesh(platterGeo, goldMaterial);
    platterMesh.position.y = 1.58;
    platterMesh.receiveShadow = true;
    platterMesh.castShadow = true;
    standGroup.add(platterMesh);

    // Decorative gold bead rim on platter
    const platterBeadCount = 44;
    for (let i = 0; i < platterBeadCount; i++) {
      const angle = (i / platterBeadCount) * Math.PI * 2;
      const beadGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const bead = new THREE.Mesh(beadGeo, goldMaterial);
      bead.position.set(Math.cos(angle) * 3.15, 1.68, Math.sin(angle) * 3.15);
      standGroup.add(bead);
    }

    this.cakeGroup.add(standGroup);

    // 2. Three Cake Tiers Parameters
    const tiers = [
      { r: 2.5, h: 1.15, y: 1.7 + 0.575 },   // Bottom Tier
      { r: 1.85, h: 1.05, y: 2.85 + 0.525 }, // Middle Tier
      { r: 1.25, h: 0.95, y: 3.9 + 0.475 }   // Top Tier
    ];

    // Wedge cutting angle (36 degrees = Math.PI / 5)
    const wedgeAngle = Math.PI / 5;
    const startAngle = wedgeAngle / 2;
    const mainAngleLength = Math.PI * 2 - wedgeAngle;

    // Groups for Main Body and Cut Wedge Slice
    const mainCakeGroup = new THREE.Group();
    this.sliceGroup = new THREE.Group();

    this.cakeGroup.add(mainCakeGroup);
    this.cakeGroup.add(this.sliceGroup);

    tiers.forEach((t, tierIndex) => {
      // --- MAIN BODY TIER ---
      const mainGeo = new THREE.CylinderGeometry(
        t.r, t.r, t.h, 48, 1, false, startAngle, mainAngleLength
      );
      const mainMesh = new THREE.Mesh(mainGeo, tierPinkMaterial);
      mainMesh.position.y = t.y;
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      mainCakeGroup.add(mainMesh);

      // --- SLICE WEDGE TIER ---
      const sliceGeo = new THREE.CylinderGeometry(
        t.r, t.r, t.h, 16, 1, false, -startAngle, wedgeAngle
      );
      const sliceMesh = new THREE.Mesh(sliceGeo, tierPinkMaterial);
      sliceMesh.position.y = t.y;
      sliceMesh.castShadow = true;
      sliceMesh.receiveShadow = true;
      this.sliceGroup.add(sliceMesh);

      // Cut interior walls (exposed sponge) for main cake body
      [-startAngle, startAngle].forEach((wallAngle, wIdx) => {
        const wallGeo = new THREE.PlaneGeometry(t.r, t.h);
        const wallMesh = new THREE.Mesh(wallGeo, cutInteriorMaterial);
        wallMesh.position.set(
          (t.r / 2) * Math.cos(wallAngle),
          t.y,
          (t.r / 2) * Math.sin(wallAngle)
        );
        wallMesh.rotation.y = -wallAngle + (wIdx === 0 ? Math.PI / 2 : -Math.PI / 2);
        mainCakeGroup.add(wallMesh);
      });

      // Cut interior walls for slice
      [-startAngle, startAngle].forEach((wallAngle, wIdx) => {
        const sliceWallGeo = new THREE.PlaneGeometry(t.r, t.h);
        const sliceWallMesh = new THREE.Mesh(sliceWallGeo, cutInteriorMaterial);
        sliceWallMesh.position.set(
          (t.r / 2) * Math.cos(wallAngle),
          t.y,
          (t.r / 2) * Math.sin(wallAngle)
        );
        sliceWallMesh.rotation.y = -wallAngle + (wIdx === 0 ? -Math.PI / 2 : Math.PI / 2);
        this.sliceGroup.add(sliceWallMesh);
      });

      // Decorative Cream Frosting Pearls along the base of each tier
      const pearlCount = Math.round(t.r * 18);
      for (let i = 0; i < pearlCount; i++) {
        const angle = (i / pearlCount) * Math.PI * 2;
        const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);

        const isGold = i % 3 === 0;
        const pearlGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const pearlMesh = new THREE.Mesh(
          pearlGeo, 
          isGold ? goldMaterial : creamPipingMaterial
        );

        const px = Math.cos(angle) * (t.r + 0.02);
        const py = t.y - t.h / 2 + 0.06;
        const pz = Math.sin(angle) * (t.r + 0.02);
        pearlMesh.position.set(px, py, pz);

        if (isSlice) {
          this.sliceGroup.add(pearlMesh);
        } else {
          mainCakeGroup.add(pearlMesh);
        }
      }

      // Scalloped Gold Drips on tier top edge
      const dripCount = Math.round(t.r * 14);
      for (let i = 0; i < dripCount; i++) {
        const angle = (i / dripCount) * Math.PI * 2;
        const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);

        const dripGeo = new THREE.SphereGeometry(0.065, 10, 10);
        const dripMesh = new THREE.Mesh(dripGeo, goldMaterial);
        const dx = Math.cos(angle) * (t.r - 0.02);
        const dy = t.y + t.h / 2 - 0.04;
        const dz = Math.sin(angle) * (t.r - 0.02);
        dripMesh.position.set(dx, dy, dz);

        if (isSlice) {
          this.sliceGroup.add(dripMesh);
        } else {
          mainCakeGroup.add(dripMesh);
        }
      }
    });

    // 3. Candles & Glowing Flames on Top Tier
    const topTierY = tiers[2].y + tiers[2].h / 2;
    const candleCount = 5;
    const candleRadius = 0.65;

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const candleGroup = new THREE.Group();

      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;
      candleGroup.position.set(cx, topTierY, cz);

      // Candle body (Spiral pink & gold wax)
      const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.65, 16);
      const candleMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xFFE0E5 : 0xD6AD68,
        roughness: 0.3,
      });
      const candleMesh = new THREE.Mesh(candleGeo, candleMat);
      candleMesh.position.y = 0.325;
      candleMesh.castShadow = true;
      candleGroup.add(candleMesh);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.y = 0.68;
      candleGroup.add(wickMesh);

      // Candle Flame (Initially hidden/scaled 0)
      const flameGeo = new THREE.ConeGeometry(0.08, 0.25, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xFFAA22,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.82;
      flameMesh.scale.set(0.001, 0.001, 0.001); // Hidden initially
      candleGroup.add(flameMesh);

      // Flame Glow Point Light
      const flameLight = new THREE.PointLight(0xFFA834, 0, 4);
      flameLight.position.y = 0.85;
      candleGroup.add(flameLight);

      this.candles.push(candleGroup);
      this.flames.push(flameMesh);
      this.candleLights.push(flameLight);

      // If candle sits on the cut slice portion
      const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);
      if (isSlice) {
        this.sliceGroup.add(candleGroup);
      } else {
        mainCakeGroup.add(candleGroup);
      }
    }

    // 4. Dessert Plate for the Cut Slice (slides in beside the cake)
    this.plateGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.08, 36);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xFFFAF5,
      roughness: 0.2,
      metalness: 0.1,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    this.plateGroup.add(plateMesh);

    // Plate gold rim
    const plateRimGeo = new THREE.TorusGeometry(1.58, 0.04, 12, 48);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, goldMaterial);
    plateRimMesh.rotation.x = Math.PI / 2;
    this.plateGroup.add(plateRimMesh);

    this.plateGroup.position.set(0, 0.6, 4.2);
    this.plateGroup.visible = false;
    this.scene.add(this.plateGroup);

    // 5. Golden Cake Knife / Server
    this.knifeGroup = new THREE.Group();
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.4, 1.6);
    bladeShape.lineTo(0.05, 3.2);
    bladeShape.lineTo(0, 3.2);
    bladeShape.closePath();

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const bladeMesh = new THREE.Mesh(bladeGeo, goldMaterial);
    bladeMesh.rotation.z = Math.PI;
    bladeMesh.position.set(0.2, 2.8, 0);
    this.knifeGroup.add(bladeMesh);

    // Knife handle
    const handleGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.4, 16);
    const handleMesh = new THREE.Mesh(handleGeo, goldMaterial);
    handleMesh.position.set(0, 3.5, 0);
    this.knifeGroup.add(handleMesh);

    this.knifeGroup.position.set(0, 8, 0);
    this.knifeGroup.visible = false;
    this.scene.add(this.knifeGroup);
  }

  // Sequence: Light candles one by one
  lightCandlesSequence() {
    if (this.candlesLit) return;
    this.candlesLit = true;

    if (this.isFallback || !this.flames.length) {
      const flames = this.container.querySelectorAll('.css-flame');
      flames.forEach((flame, idx) => {
        setTimeout(() => {
          audioManager.playIgnite();
          flame.classList.add('lit');
        }, idx * 300);
      });
      return;
    }

    this.flames.forEach((flame, idx) => {
      setTimeout(() => {
        audioManager.playIgnite();
        // Scale up flame
        let progress = 0;
        const lightInterval = setInterval(() => {
          progress += 0.1;
          const s = Math.min(1, progress);
          flame.scale.set(s, s, s);
          if (this.candleLights[idx]) {
            this.candleLights[idx].intensity = s * 1.4;
          }
          if (progress >= 1) clearInterval(lightInterval);
        }, 20);
      }, idx * 300);
    });
  }

  // Cake-cutting animation
  cutTheCake(onComplete) {
    if (this.isCutting || this.isCut) return;
    this.isCutting = true;

    audioManager.playSliceSound();

    // Fallback animation if WebGL is unavailable
    if (this.isFallback || !this.knifeGroup) {
      const wrapper = this.container.querySelector('.css-cake-wrapper');
      if (wrapper) wrapper.classList.add('is-slicing');

      setTimeout(() => {
        if (wrapper) {
          wrapper.classList.remove('is-slicing');
          wrapper.classList.add('is-cut');
        }
        this.isCut = true;
        this.isCutting = false;
        if (onComplete) onComplete();
      }, 1600);
      return;
    }

    // 1. Position knife above cake
    this.knifeGroup.visible = true;
    this.knifeGroup.position.set(0, 6.5, 0.4);
    this.knifeGroup.rotation.set(0.3, 0, 0.1);

    // Stop auto-rotation to align slice
    this.cakeGroup.rotation.y = 0;

    let startTime = performance.now();
    const duration = 1200;

    // Animate knife descending and cutting through tiers
    const animateCut = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);

      // Smooth ease-in-out
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.knifeGroup.position.y = 6.5 - easeT * 3.8;
      this.knifeGroup.rotation.x = 0.3 - easeT * 0.15;

      if (t < 1) {
        requestAnimationFrame(animateCut);
      } else {
        // Knife retracts
        setTimeout(() => {
          let retractStart = performance.now();
          const retractAnim = (rTime) => {
            const rElapsed = rTime - retractStart;
            const rt = Math.min(1, rElapsed / 500);
            this.knifeGroup.position.y = 2.7 + rt * 4;
            this.knifeGroup.rotation.x = 0.15 - rt * 0.3;
            if (rt < 1) {
              requestAnimationFrame(retractAnim);
            } else {
              this.knifeGroup.visible = false;
              this.animateSliceSeparation(onComplete);
            }
          };
          requestAnimationFrame(retractAnim);
        }, 150);
      }
    };

    requestAnimationFrame(animateCut);
  }

  // Animate slice moving outwards onto the dessert plate
  animateSliceSeparation(onComplete) {
    this.plateGroup.visible = true;
    this.plateGroup.position.set(0, 0.6, 3.8);

    let start = performance.now();
    const dur = 1400;

    const animSlice = (time) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / dur);
      // Soft elastic bounce / smooth cubic
      const ease = 1 - Math.pow(1 - t, 3);

      // Slide wedge along Z axis and slightly down onto plate
      this.sliceGroup.position.z = ease * 2.6;
      this.sliceGroup.position.y = -ease * 0.8;
      this.sliceGroup.position.x = ease * 0.4;
      this.sliceGroup.rotation.y = ease * 0.18;
      this.sliceGroup.rotation.z = -ease * 0.08;

      if (t < 1) {
        requestAnimationFrame(animSlice);
      } else {
        this.isCut = true;
        this.isCutting = false;
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animSlice);
  }

  // Reset cake to initial state for "CELEBRATE AGAIN"
  resetCelebration() {
    this.isCut = false;
    this.isCutting = false;

    if (this.isFallback || !this.sliceGroup) {
      this.candlesLit = false;
      const wrapper = this.container.querySelector('.css-cake-wrapper');
      if (wrapper) {
        wrapper.classList.remove('is-cut', 'is-slicing');
      }
      const flames = this.container.querySelectorAll('.css-flame');
      flames.forEach(f => f.classList.remove('lit'));
      setTimeout(() => {
        this.lightCandlesSequence();
      }, 400);
      return;
    }

    this.plateGroup.visible = false;

    // Reset slice position
    this.sliceGroup.position.set(0, 0, 0);
    this.sliceGroup.rotation.set(0, 0, 0);

    // Re-light candles
    this.candlesLit = false;
    this.flames.forEach((flame, i) => {
      flame.scale.set(0.001, 0.001, 0.001);
      if (this.candleLights[i]) this.candleLights[i].intensity = 0;
    });

    setTimeout(() => {
      this.lightCandlesSequence();
    }, 400);
  }

  setupInteraction() {
    const canvas = this.renderer.domElement;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging || this.isCutting) return;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.cakeGroup.rotation.y += deltaX * 0.008;
      this.cakeGroup.rotation.x = Math.max(-0.25, Math.min(0.35, this.cakeGroup.rotation.x + deltaY * 0.004));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    // Touch Events
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera || !this.cakeGroup) return;

    const time = performance.now() * 0.001;

    // Gentle auto-rotation when idle and not cutting
    if (!this.isDragging && !this.isCutting && !this.isCut) {
      this.cakeGroup.rotation.y += this.rotationVelocity;
    }

    // Flame flicker physics
    if (this.candlesLit) {
      this.flames.forEach((flame, i) => {
        const flicker = Math.sin(time * 16 + i * 2) * 0.12 + Math.cos(time * 23 + i) * 0.08;
        flame.scale.x = 1 + flicker;
        flame.scale.z = 1 + flicker;
        flame.scale.y = 1 - flicker * 0.5;

        if (this.candleLights[i]) {
          this.candleLights[i].intensity = 1.2 + flicker * 0.5;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

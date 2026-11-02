// Three.js 3D Realistic Luxury Pink Birthday Cake Scene for Riya
import * as THREE from 'three';
import { audioManager } from './audio.js';

export class Cake3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || 380;
    this.height = this.container.clientHeight || 420;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cakeGroup = null;
    this.sliceGroup = null;
    this.plateGroup = null;
    this.knifeGroup = null;
    this.topperGroup = null;

    this.candles = [];
    this.flames = [];
    this.candleLights = [];

    this.isCut = false;
    this.isCutting = false;
    this.candlesLit = false;
    this.isDragging = false;
    this.isFallback = false;

    // Touch & Inertia Controls
    this.previousPointerPos = { x: 0, y: 0 };
    this.rotationVelocityY = 0;
    this.rotationVelocityX = 0;
    this.baseRotationSpeed = 0.0035;

    // Device Tilt / Gyroscope
    this.deviceOrientationEnabled = false;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.targetTiltZ = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;
    this.currentTiltZ = 0;

    this.onCutCallback = null;

    this.init();
  }

  init() {
    try {
      // 1. Scene setup
      this.scene = new THREE.Scene();

      // 2. Camera setup - mobile optimized perspective
      this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
      this.camera.position.set(0, 4.0, 10.2);
      this.camera.lookAt(0, 2.3, 0);

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
      this.renderer.toneMappingExposure = 1.15;

      // 4. Studio Lighting
      this.setupLighting();

      // 5. Build 3D Luxury Cake
      this.buildCake();

      // 6. Setup Interaction (Touch, Drag & Inertia)
      this.setupTouchAndDrag();

      // 7. Setup Device Tilt & Gyroscope
      this.setupDeviceOrientation();

      // 8. Handle Window Resize
      window.addEventListener('resize', () => this.onResize(), { passive: true });

      // 9. Animation loop
      this.animate();
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      this.renderCSSFallback();
    }
  }

  setupLighting() {
    // Warm champagne ambient lighting
    const ambientLight = new THREE.AmbientLight(0xFFF2E6, 1.1);
    this.scene.add(ambientLight);

    // Warm key light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.5);
    keyLight.position.set(5, 11, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Blush pink fill light for sweet fondant depth
    const fillLight = new THREE.DirectionalLight(0xF8DAD8, 0.85);
    fillLight.position.set(-6, 5, -3);
    this.scene.add(fillLight);

    // Golden specular rim light for metallic accents
    const rimLight = new THREE.DirectionalLight(0xD6AD68, 1.1);
    rimLight.position.set(0, -1, -7);
    this.scene.add(rimLight);

    // Front soft beauty light
    const frontLight = new THREE.PointLight(0xFFFAF2, 0.5, 15);
    frontLight.position.set(0, 3.5, 6);
    this.scene.add(frontLight);
  }

  // Multi-layered sponge texture for cut slice interior
  createLayeredCakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Pink vanilla sponge base
    ctx.fillStyle = '#FCE3E7';
    ctx.fillRect(0, 0, 256, 256);

    // Alternating layers: Sponge, Rich Strawberry Filling, Ivory Cream
    const layerColors = [
      '#F4BCC6', '#FFFFFF', '#D94D60', '#F4BCC6', 
      '#FFFFFF', '#D94D60', '#F4BCC6', '#FFFFFF'
    ];
    const layerH = 256 / layerColors.length;

    layerColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * layerH, 256, layerH);
      // Sponge air pockets
      ctx.fillStyle = 'rgba(0,0,0,0.035)';
      for (let i = 0; i < 240; i++) {
        ctx.fillRect(Math.random() * 256, idx * layerH + Math.random() * layerH, 2, 2);
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Procedural 3D Blush Pink Rose
  create3DRoseMesh(scale = 0.3) {
    const roseGroup = new THREE.Group();
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xF8B6C2,
      roughness: 0.45,
      metalness: 0.05,
      bumpScale: 0.02
    });

    // Center bud
    const budGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const budMesh = new THREE.Mesh(budGeo, petalMat);
    budMesh.scale.set(0.8, 1.1, 0.8);
    roseGroup.add(budMesh);

    // Inner petals
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.SphereGeometry(0.26, 12, 12, 0, Math.PI);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.16, 0.05, Math.sin(angle) * 0.16);
      petal.rotation.set(0.35, angle, 0.2);
      petal.scale.set(0.9, 1.2, 0.35);
      petal.castShadow = true;
      roseGroup.add(petal);
    }

    // Outer blooming petals
    const outerCount = 10;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + 0.3;
      const petalGeo = new THREE.SphereGeometry(0.34, 12, 12, 0, Math.PI);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.3, -0.05, Math.sin(angle) * 0.3);
      petal.rotation.set(0.65, angle, 0.35);
      petal.scale.set(1.0, 1.1, 0.3);
      petal.castShadow = true;
      roseGroup.add(petal);
    }

    // Golden pistil accents
    const goldPistilMat = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.85,
      roughness: 0.25
    });
    const pistil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), goldPistilMat);
    pistil.position.y = 0.22;
    roseGroup.add(pistil);

    roseGroup.scale.set(scale, scale, scale);
    return roseGroup;
  }

  // Procedural 3D White Flower (Peony / Blossom)
  create3DWhiteFlowerMesh(scale = 0.26) {
    const flowerGroup = new THREE.Group();
    const whitePetalMat = new THREE.MeshStandardMaterial({
      color: 0xFFFCF7,
      roughness: 0.35,
      metalness: 0.02
    });
    const goldCenterMat = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.88,
      roughness: 0.2
    });

    // 5 delicate petals
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const pGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const petal = new THREE.Mesh(pGeo, whitePetalMat);
      petal.scale.set(0.65, 0.2, 1.2);
      petal.position.set(Math.cos(angle) * 0.24, 0, Math.sin(angle) * 0.24);
      petal.rotation.y = angle;
      petal.rotation.x = 0.2;
      petal.castShadow = true;
      flowerGroup.add(petal);
    }

    // Golden center bead
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), goldCenterMat);
    center.position.y = 0.06;
    flowerGroup.add(center);

    flowerGroup.scale.set(scale, scale, scale);
    return flowerGroup;
  }

  // 3D Metallic Golden Birthday Topper ("Happy Birthday")
  createGoldBirthdayTopper() {
    const topperGroup = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.92,
      roughness: 0.18,
    });

    // Support dowels into top tier
    [-0.55, 0.55].forEach(x => {
      const dowelGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.95, 12);
      const dowelMesh = new THREE.Mesh(dowelGeo, goldMat);
      dowelMesh.position.set(x, 0.45, 0);
      dowelMesh.castShadow = true;
      topperGroup.add(dowelMesh);
    });

    // Decorative cursive arch
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, 0.9, 0),
      new THREE.Vector3(-0.6, 1.35, 0),
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0.6, 1.35, 0),
      new THREE.Vector3(1.1, 0.9, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.05, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, goldMat);
    tubeMesh.castShadow = true;
    topperGroup.add(tubeMesh);

    // Lettering plaque banner: "HAPPY BIRTHDAY"
    const bannerGeo = new THREE.BoxGeometry(1.8, 0.45, 0.06);
    const bannerMesh = new THREE.Mesh(bannerGeo, goldMat);
    bannerMesh.position.set(0, 1.05, 0);
    bannerMesh.castShadow = true;
    topperGroup.add(bannerMesh);

    // Sparkling stars on topper
    [-0.95, 0.95].forEach(x => {
      const starGeo = new THREE.OctahedronGeometry(0.12, 0);
      const starMesh = new THREE.Mesh(starGeo, goldMat);
      starMesh.position.set(x, 1.35, 0.02);
      starMesh.rotation.z = Math.PI / 4;
      topperGroup.add(starMesh);
    });

    return topperGroup;
  }

  buildCake() {
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.position.set(0, -0.6, 0);
    this.scene.add(this.cakeGroup);

    // Core Materials matching Visual Reference:
    // 1. Luxury Metallic Champagne Gold
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.88,
      roughness: 0.22,
    });

    // 2. Blush Pink Fondant Frosting
    const tierPinkMaterial = new THREE.MeshStandardMaterial({
      color: 0xF8BCC6,
      roughness: 0.38,
      metalness: 0.06,
    });

    // 3. Ivory Cream Piping
    const creamPipingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFDF8,
      roughness: 0.3,
      metalness: 0.03,
    });

    // 4. Cut Cake Multi-Layer Interior
    const cutInteriorMaterial = new THREE.MeshStandardMaterial({
      map: this.createLayeredCakeTexture(),
      roughness: 0.6,
      metalness: 0.05,
    });

    // ==========================================
    // 1. Champagne Gold Pedestal Cake Stand
    // ==========================================
    const standGroup = new THREE.Group();

    // Stand Base
    const baseGeo = new THREE.CylinderGeometry(2.3, 2.65, 0.26, 48);
    const baseMesh = new THREE.Mesh(baseGeo, goldMaterial);
    baseMesh.position.y = 0.13;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    standGroup.add(baseMesh);

    // Stand Stem (sculpted hourglass)
    const stemGeo = new THREE.CylinderGeometry(0.5, 0.95, 1.25, 32);
    const stemMesh = new THREE.Mesh(stemGeo, goldMaterial);
    stemMesh.position.y = 0.88;
    stemMesh.castShadow = true;
    standGroup.add(stemMesh);

    // Stand Platter
    const platterGeo = new THREE.CylinderGeometry(3.1, 2.9, 0.2, 48);
    const platterMesh = new THREE.Mesh(platterGeo, goldMaterial);
    platterMesh.position.y = 1.58;
    platterMesh.receiveShadow = true;
    platterMesh.castShadow = true;
    standGroup.add(platterMesh);

    // Decorative Gold Pearls on Platter Rim
    const platterBeads = 44;
    for (let i = 0; i < platterBeads; i++) {
      const angle = (i / platterBeads) * Math.PI * 2;
      const beadGeo = new THREE.SphereGeometry(0.075, 10, 10);
      const bead = new THREE.Mesh(beadGeo, goldMaterial);
      bead.position.set(Math.cos(angle) * 3.05, 1.68, Math.sin(angle) * 3.05);
      standGroup.add(bead);
    }
    this.cakeGroup.add(standGroup);

    // ==========================================
    // 2. Three Cake Tiers Dimensions
    // ==========================================
    const tiers = [
      { r: 2.45, h: 1.15, y: 1.7 + 0.575 },   // Bottom Tier
      { r: 1.80, h: 1.05, y: 2.85 + 0.525 }, // Middle Tier
      { r: 1.20, h: 0.95, y: 3.9 + 0.475 }   // Top Tier
    ];

    // Wedge Cutting Angle (36 degrees = Math.PI / 5)
    const wedgeAngle = Math.PI / 5;
    const startAngle = wedgeAngle / 2;
    const mainAngleLength = Math.PI * 2 - wedgeAngle;

    const mainCakeGroup = new THREE.Group();
    this.sliceGroup = new THREE.Group();

    this.cakeGroup.add(mainCakeGroup);
    this.cakeGroup.add(this.sliceGroup);

    tiers.forEach((t, tierIndex) => {
      // Main Body
      const mainGeo = new THREE.CylinderGeometry(
        t.r, t.r, t.h, 48, 1, false, startAngle, mainAngleLength
      );
      const mainMesh = new THREE.Mesh(mainGeo, tierPinkMaterial);
      mainMesh.position.y = t.y;
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      mainCakeGroup.add(mainMesh);

      // Slice Wedge
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

      // Golden Ribbon Band around center of each tier
      const bandHeight = 0.08;
      const bandGeo = new THREE.CylinderGeometry(
        t.r + 0.015, t.r + 0.015, bandHeight, 48, 1, false, startAngle, mainAngleLength
      );
      const bandMesh = new THREE.Mesh(bandGeo, goldMaterial);
      bandMesh.position.y = t.y;
      mainCakeGroup.add(bandMesh);

      const sliceBandGeo = new THREE.CylinderGeometry(
        t.r + 0.015, t.r + 0.015, bandHeight, 16, 1, false, -startAngle, wedgeAngle
      );
      const sliceBandMesh = new THREE.Mesh(sliceBandGeo, goldMaterial);
      sliceBandMesh.position.y = t.y;
      this.sliceGroup.add(sliceBandMesh);

      // Cream Frosting Pearls along base of each tier
      const pearlCount = Math.round(t.r * 18);
      for (let i = 0; i < pearlCount; i++) {
        const angle = (i / pearlCount) * Math.PI * 2;
        const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);

        const isGold = i % 3 === 0;
        const pearlGeo = new THREE.SphereGeometry(0.075, 10, 10);
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

        const dripGeo = new THREE.SphereGeometry(0.06, 10, 10);
        const dripMesh = new THREE.Mesh(dripGeo, goldMaterial);
        const dx = Math.cos(angle) * (t.r - 0.02);
        const dy = t.y + t.h / 2 - 0.035;
        const dz = Math.sin(angle) * (t.r - 0.02);
        dripMesh.position.set(dx, dy, dz);

        if (isSlice) {
          this.sliceGroup.add(dripMesh);
        } else {
          mainCakeGroup.add(dripMesh);
        }
      }
    });

    // ==========================================
    // 3. 3D Floral Embellishments (Roses & White Flowers)
    // ==========================================
    // Cascading floral arrangements on the tiers (matching reference image)
    const floralPlacements = [
      // Junction of top tier & middle tier (Front-Left)
      { type: 'rose', scale: 0.38, x: -1.05, y: 3.9, z: 0.85, rx: 0.3, ry: -0.4, rz: 0.2 },
      { type: 'white', scale: 0.28, x: -1.35, y: 3.75, z: 0.7, rx: 0.4, ry: -0.6, rz: 0.1 },
      { type: 'rose', scale: 0.32, x: -0.85, y: 4.15, z: 0.75, rx: 0.2, ry: -0.2, rz: 0.15 },

      // Junction of middle tier & bottom tier (Right side)
      { type: 'white', scale: 0.32, x: 1.65, y: 2.85, z: 0.8, rx: 0.2, ry: 0.6, rz: -0.2 },
      { type: 'rose', scale: 0.42, x: 1.45, y: 2.7, z: 1.1, rx: 0.3, ry: 0.4, rz: -0.1 },
      { type: 'white', scale: 0.26, x: 1.85, y: 2.6, z: 0.6, rx: 0.3, ry: 0.8, rz: -0.3 },

      // Base platter flower cluster
      { type: 'rose', scale: 0.45, x: -1.8, y: 1.85, z: 1.6, rx: 0.2, ry: -0.5, rz: 0.2 },
      { type: 'white', scale: 0.34, x: -2.15, y: 1.8, z: 1.3, rx: 0.3, ry: -0.7, rz: 0.1 }
    ];

    floralPlacements.forEach(fp => {
      const flower = fp.type === 'rose' 
        ? this.create3DRoseMesh(fp.scale)
        : this.create3DWhiteFlowerMesh(fp.scale);

      flower.position.set(fp.x, fp.y, fp.z);
      flower.rotation.set(fp.rx, fp.ry, fp.rz);
      mainCakeGroup.add(flower);
    });

    // ==========================================
    // 4. Golden Birthday Topper on Top Tier
    // ==========================================
    const topTierY = tiers[2].y + tiers[2].h / 2;
    this.topperGroup = this.createGoldBirthdayTopper();
    this.topperGroup.position.set(0, topTierY, 0);
    mainCakeGroup.add(this.topperGroup);

    // ==========================================
    // 5. Birthday Candles & Animated Glowing Flames
    // ==========================================
    const candleCount = 5;
    const candleRadius = 0.62;

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const candleGroup = new THREE.Group();

      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;
      candleGroup.position.set(cx, topTierY, cz);

      // Spiral striped wax candle (blush pink & gold)
      const candleGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.65, 16);
      const candleMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xFFE0E5 : 0xD6AD68,
        roughness: 0.3,
      });
      const candleMesh = new THREE.Mesh(candleGeo, candleMat);
      candleMesh.position.y = 0.325;
      candleMesh.castShadow = true;
      candleGroup.add(candleMesh);

      // Candle Wick
      const wickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.y = 0.68;
      candleGroup.add(wickMesh);

      // Flickering Flame Cone
      const flameGeo = new THREE.ConeGeometry(0.08, 0.25, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xFFAA22,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.82;
      flameMesh.scale.set(0.001, 0.001, 0.001); // Initially unlit
      candleGroup.add(flameMesh);

      // Flame Glow Point Light
      const flameLight = new THREE.PointLight(0xFFA834, 0, 4);
      flameLight.position.y = 0.85;
      candleGroup.add(flameLight);

      this.candles.push(candleGroup);
      this.flames.push(flameMesh);
      this.candleLights.push(flameLight);

      const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);
      if (isSlice) {
        this.sliceGroup.add(candleGroup);
      } else {
        mainCakeGroup.add(candleGroup);
      }
    }

    // ==========================================
    // 6. Gold-Rimmed Dessert Plate for Cut Slice
    // ==========================================
    this.plateGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.08, 36);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xFFFAF5,
      roughness: 0.2,
      metalness: 0.1,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    this.plateGroup.add(plateMesh);

    const plateRimGeo = new THREE.TorusGeometry(1.58, 0.04, 12, 48);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, goldMaterial);
    plateRimMesh.rotation.x = Math.PI / 2;
    this.plateGroup.add(plateRimMesh);

    this.plateGroup.position.set(0, 0.6, 4.0);
    this.plateGroup.visible = false;
    this.scene.add(this.plateGroup);

    // ==========================================
    // 7. Golden Cake Knife / Server
    // ==========================================
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

    const handleGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.4, 16);
    const handleMesh = new THREE.Mesh(handleGeo, goldMaterial);
    handleMesh.position.set(0, 3.5, 0);
    this.knifeGroup.add(handleMesh);

    this.knifeGroup.position.set(0, 8, 0);
    this.knifeGroup.visible = false;
    this.scene.add(this.knifeGroup);
  }

  // Sequentially ignite candles with chime
  lightCandlesSequence() {
    if (this.candlesLit) return;
    this.candlesLit = true;

    if (this.isFallback || !this.flames.length) {
      const flames = this.container.querySelectorAll('.css-flame');
      flames.forEach((flame, idx) => {
        setTimeout(() => {
          audioManager.playIgnite();
          flame.classList.add('lit');
        }, idx * 280);
      });
      return;
    }

    this.flames.forEach((flame, idx) => {
      setTimeout(() => {
        audioManager.playIgnite();
        let progress = 0;
        const lightInterval = setInterval(() => {
          progress += 0.12;
          const s = Math.min(1, progress);
          flame.scale.set(s, s, s);
          if (this.candleLights[idx]) {
            this.candleLights[idx].intensity = s * 1.5;
          }
          if (progress >= 1) clearInterval(lightInterval);
        }, 20);
      }, idx * 280);
    });
  }

  // Animated Cake Cutting
  cutTheCake(onComplete) {
    if (this.isCutting || this.isCut) return;
    this.isCutting = true;
    this.onCutCallback = onComplete;

    audioManager.playSliceSound();

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

    // Align knife above cake
    this.knifeGroup.visible = true;
    this.knifeGroup.position.set(0, 6.6, 0.4);
    this.knifeGroup.rotation.set(0.3, 0, 0.1);

    // Stop auto-rotation & align slice front
    this.cakeGroup.rotation.y = 0;
    this.rotationVelocityY = 0;

    let startTime = performance.now();
    const duration = 1200;

    const animateCut = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.knifeGroup.position.y = 6.6 - easeT * 3.8;
      this.knifeGroup.rotation.x = 0.3 - easeT * 0.15;

      if (t < 1) {
        requestAnimationFrame(animateCut);
      } else {
        setTimeout(() => {
          let retractStart = performance.now();
          const retractAnim = (rTime) => {
            const rElapsed = rTime - retractStart;
            const rt = Math.min(1, rElapsed / 500);
            this.knifeGroup.position.y = 2.8 + rt * 4;
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

  // Smooth wedge separation onto the dessert plate
  animateSliceSeparation(onComplete) {
    this.plateGroup.visible = true;
    this.plateGroup.position.set(0, 0.6, 3.8);

    let start = performance.now();
    const dur = 1400;

    const animSlice = (time) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / dur);
      const ease = 1 - Math.pow(1 - t, 3); // soft cubic ease-out

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

  // Reset celebration to replay
  resetCelebration() {
    this.isCut = false;
    this.isCutting = false;

    if (this.isFallback || !this.sliceGroup) {
      this.candlesLit = false;
      const wrapper = this.container.querySelector('.css-cake-wrapper');
      if (wrapper) wrapper.classList.remove('is-cut', 'is-slicing');
      const flames = this.container.querySelectorAll('.css-flame');
      flames.forEach(f => f.classList.remove('lit'));
      setTimeout(() => this.lightCandlesSequence(), 400);
      return;
    }

    this.plateGroup.visible = false;
    this.sliceGroup.position.set(0, 0, 0);
    this.sliceGroup.rotation.set(0, 0, 0);

    this.candlesLit = false;
    this.flames.forEach((flame, i) => {
      flame.scale.set(0.001, 0.001, 0.001);
      if (this.candleLights[i]) this.candleLights[i].intensity = 0;
    });

    setTimeout(() => this.lightCandlesSequence(), 400);
  }

  // Touch and Drag with Smooth Inertia Momentum
  setupTouchAndDrag() {
    const canvas = this.renderer.domElement;

    const handlePointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousPointerPos = { x: clientX, y: clientY };
      this.rotationVelocityY = 0;
      this.rotationVelocityX = 0;
    };

    const handlePointerMove = (clientX, clientY) => {
      if (!this.isDragging || this.isCutting) return;

      const deltaX = clientX - this.previousPointerPos.x;
      const deltaY = clientY - this.previousPointerPos.y;

      this.rotationVelocityY = deltaX * 0.007;
      this.rotationVelocityX = deltaY * 0.004;

      this.cakeGroup.rotation.y += this.rotationVelocityY;
      this.cakeGroup.rotation.x = Math.max(-0.25, Math.min(0.35, this.cakeGroup.rotation.x + this.rotationVelocityX));

      this.previousPointerPos = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      this.isDragging = false;
    };

    // Mouse Listeners
    canvas.addEventListener('mousedown', (e) => handlePointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handlePointerUp);

    // Mobile Touch Listeners (Smooth one-finger drag)
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);
  }

  // DeviceOrientation API & iOS Permission Request
  setupDeviceOrientation() {
    const motionBtn = document.getElementById('btn-enable-motion');

    const handleOrientation = (event) => {
      if (!this.deviceOrientationEnabled) return;

      // gamma: left-to-right tilt in degrees [-90, 90]
      // beta: front-to-back tilt in degrees [-180, 180]
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      // Normal holding position is ~45deg beta on mobile portrait
      const normalizedBeta = beta - 45;

      // Map to subtle 3D rotational tilt
      this.targetTiltY = (gamma / 45) * 0.35;
      this.targetTiltX = (normalizedBeta / 45) * 0.25;
      this.targetTiltZ = -(gamma / 45) * 0.12;
    };

    const enableMotion = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceOrientationEvent.requestPermission();
          if (permissionState === 'granted') {
            this.deviceOrientationEnabled = true;
            window.addEventListener('deviceorientation', handleOrientation, true);
            if (motionBtn) {
              motionBtn.textContent = '3D MOTION ACTIVE ✨';
              motionBtn.classList.add('active');
            }
          } else {
            console.warn('Device motion permission denied');
          }
        } catch (e) {
          console.warn('Motion permission request error:', e);
        }
      } else if ('ondeviceorientation' in window) {
        this.deviceOrientationEnabled = true;
        window.addEventListener('deviceorientation', handleOrientation, true);
        if (motionBtn) {
          motionBtn.textContent = '3D MOTION ACTIVE ✨';
          motionBtn.classList.add('active');
        }
      }
    };

    if (motionBtn) {
      motionBtn.addEventListener('click', () => {
        audioManager.playChime();
        enableMotion();
      });
    }

    // Auto-listen on non-iOS browsers without blocking
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      this.deviceOrientationEnabled = true;
      window.addEventListener('deviceorientation', handleOrientation, true);
      if (motionBtn) {
        motionBtn.textContent = '3D MOTION ACTIVE ✨';
        motionBtn.classList.add('active');
      }
    }
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

    // 1. Inertia & Idle Rotation
    if (!this.isDragging && !this.isCutting && !this.isCut) {
      if (Math.abs(this.rotationVelocityY) > 0.0002) {
        // Smoothly decay drag inertia
        this.cakeGroup.rotation.y += this.rotationVelocityY;
        this.rotationVelocityY *= 0.94;
      } else {
        // Continuous gentle auto-rotation
        this.cakeGroup.rotation.y += this.baseRotationSpeed;
      }

      if (Math.abs(this.rotationVelocityX) > 0.0002) {
        this.cakeGroup.rotation.x += this.rotationVelocityX;
        this.rotationVelocityX *= 0.92;
      }
    }

    // 2. Gyroscope / Device Tilt Physics (Lerp damping)
    if (this.deviceOrientationEnabled) {
      this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
      this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;
      this.currentTiltZ += (this.targetTiltZ - this.currentTiltZ) * 0.08;

      // Apply tilt to camera position for realistic perspective parallax
      this.camera.position.x = this.currentTiltY * 2.2;
      this.camera.position.y = 4.0 - this.currentTiltX * 1.5;
      this.camera.lookAt(0, 2.3, 0);
    }

    // 3. Flame Flicker Animation
    if (this.candlesLit) {
      this.flames.forEach((flame, i) => {
        const flicker = Math.sin(time * 18 + i * 2.5) * 0.12 + Math.cos(time * 24 + i) * 0.08;
        flame.scale.x = 1 + flicker;
        flame.scale.z = 1 + flicker;
        flame.scale.y = 1 - flicker * 0.5;

        if (this.candleLights[i]) {
          this.candleLights[i].intensity = 1.3 + flicker * 0.5;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Graceful CSS Fallback
  renderCSSFallback() {
    this.isFallback = true;
    const stage = document.getElementById('cake-stage-container');
    if (!stage || stage.querySelector('.css-cake-fallback')) return;

    const fallback = document.createElement('div');
    fallback.className = 'css-cake-fallback';
    fallback.innerHTML = `
      <div class="css-cake-wrapper">
        <div class="css-knife" aria-hidden="true">
          <div class="css-knife-blade"></div>
          <div class="css-knife-handle"></div>
        </div>
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
}

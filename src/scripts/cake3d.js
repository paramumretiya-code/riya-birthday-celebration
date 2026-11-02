// Three.js 3D Luxury Cake Scene closely matching cake_reference.jpg
// Single-tier wide cylindrical cake with painted blush sash, gold foil, micro fairy lights,
// 3D mirror-gold cursive topper, roses, gold spheres, pedestal stand, and high-responsiveness tilt physics!
import * as THREE from 'three';
import { audioManager } from './audio.js';
import { createLuxuryCakeTexture, createButtercreamBumpMap } from './cakeTexture.js';

export class Cake3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || 380;
    this.height = this.container.clientHeight || 440;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cakeGroup = null;
    this.sliceGroup = null;
    this.plateGroup = null;
    this.knifeGroup = null;
    this.topperGroup = null;
    this.keyLight = null;
    this.candleLight = null;
    this.flameMesh = null;

    this.isCut = false;
    this.isCutting = false;
    this.candleLit = false;
    this.isDragging = false;
    this.isFallback = false;

    // High-responsiveness Touch & Drag Inertia
    this.previousPointerPos = { x: 0, y: 0 };
    this.rotationVelocityY = 0;
    this.rotationVelocityX = 0;
    this.baseRotationSpeed = 0.003;

    // Super Responsive Device Tilt & Gyroscope
    this.deviceOrientationEnabled = false;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.targetTiltZ = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;
    this.currentTiltZ = 0;

    this.init();
  }

  init() {
    try {
      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera: Wide mobile perspective
      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
      this.camera.position.set(0, 3.8, 9.6);
      this.camera.lookAt(0, 2.0, 0);

      // 3. WebGL Renderer
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
      this.renderer.toneMappingExposure = 1.25;

      // 4. Studio Lighting matching cake_reference.jpg
      this.setupLighting();

      // 5. Build Cake matching cake_reference.jpg
      this.buildCake();

      // 6. Interactive Touch & Drag Controls
      this.setupTouchAndDrag();

      // 7. Ultra-Responsive Device Tilt Gyroscope
      this.setupDeviceOrientation();

      // 8. Responsive resize
      window.addEventListener('resize', () => this.onResize(), { passive: true });

      // 9. Animation loop
      this.animate();
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      this.renderCSSFallback();
    }
  }

  setupLighting() {
    // Warm champagne ambient fill
    const ambientLight = new THREE.AmbientLight(0xFFF3E8, 1.25);
    this.scene.add(ambientLight);

    // Warm Key Light casting soft shadows
    this.keyLight = new THREE.DirectionalLight(0xFFF9F0, 1.6);
    this.keyLight.position.set(5, 10, 7);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Blush pink fill light for sweet undertones
    const fillLight = new THREE.DirectionalLight(0xF8DAD8, 0.95);
    fillLight.position.set(-6, 5, -2);
    this.scene.add(fillLight);

    // Mirror-gold specular rim light
    const rimLight = new THREE.DirectionalLight(0xD6AD68, 1.3);
    rimLight.position.set(0, -1, -6);
    this.scene.add(rimLight);

    // Front beauty spotlight for the gold topper & sash
    const frontSpot = new THREE.SpotLight(0xFFFAF2, 0.9, 15, Math.PI / 4, 0.4);
    frontSpot.position.set(0, 4.5, 6.5);
    this.scene.add(frontSpot);
  }

  // Multi-layered sponge texture for cut slice interior
  createLayeredCakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFF2F5';
    ctx.fillRect(0, 0, 256, 256);

    const layerColors = [
      '#F4BAC6', '#FFFFFF', '#D94D60', '#F4BAC6', 
      '#FFFFFF', '#D94D60', '#F4BAC6', '#FFFFFF'
    ];
    const layerH = 256 / layerColors.length;

    layerColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * layerH, 256, layerH);
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(Math.random() * 256, idx * layerH + Math.random() * layerH, 2, 2);
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // 3D Realistic Curled Blush Garden Rose
  create3DRoseMesh(scale = 0.35) {
    const roseGroup = new THREE.Group();
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xF7B6C2,
      roughness: 0.42,
      metalness: 0.04
    });

    // Center spiral bud
    const bud = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), petalMat);
    bud.scale.set(0.75, 1.1, 0.75);
    roseGroup.add(bud);

    // Inner petals
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12, 0, Math.PI), petalMat);
      petal.position.set(Math.cos(angle) * 0.18, 0.06, Math.sin(angle) * 0.18);
      petal.rotation.set(0.4, angle, 0.25);
      petal.scale.set(0.9, 1.15, 0.3);
      petal.castShadow = true;
      roseGroup.add(petal);
    }

    // Outer blooming petals
    for (let i = 0; i < 11; i++) {
      const angle = (i / 11) * Math.PI * 2 + 0.2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12, 0, Math.PI), petalMat);
      petal.position.set(Math.cos(angle) * 0.35, -0.04, Math.sin(angle) * 0.35);
      petal.rotation.set(0.7, angle, 0.4);
      petal.scale.set(1.0, 1.1, 0.25);
      petal.castShadow = true;
      roseGroup.add(petal);
    }

    roseGroup.scale.set(scale, scale, scale);
    return roseGroup;
  }

  // 3D White Mini Flower
  create3DWhiteFlower(scale = 0.22) {
    const flowerGroup = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFCF7, roughness: 0.3 });
    const goldPistilMat = new THREE.MeshStandardMaterial({ color: 0xD6AD68, metalness: 0.9, roughness: 0.2 });

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), whiteMat);
      petal.scale.set(0.65, 0.2, 1.1);
      petal.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
      petal.rotation.y = angle;
      flowerGroup.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), goldPistilMat);
    center.position.y = 0.05;
    flowerGroup.add(center);

    flowerGroup.scale.set(scale, scale, scale);
    return flowerGroup;
  }

  // 3D Mirror-Gold Acrylic Calligraphy Cake Topper ("Happy Birthday" + Heart)
  createMirrorGoldTopper() {
    const topperGroup = new THREE.Group();
    const mirrorGoldMat = new THREE.MeshStandardMaterial({
      color: 0xFFE6A3,
      metalness: 0.96,
      roughness: 0.12,
    });

    // Vertical mounting stem
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 16);
    const stemMesh = new THREE.Mesh(stemGeo, mirrorGoldMat);
    stemMesh.position.set(0, 0.8, 0);
    topperGroup.add(stemMesh);

    // Calligraphy cursive loops for "Happy Birthday"
    // Loop 1: Top banner arch
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, 1.5, 0),
      new THREE.Vector3(-0.7, 2.1, 0),
      new THREE.Vector3(0, 2.3, 0),
      new THREE.Vector3(0.7, 2.1, 0),
      new THREE.Vector3(1.3, 1.5, 0)
    ]);
    const archGeo = new THREE.TubeGeometry(archCurve, 32, 0.065, 12, false);
    const archMesh = new THREE.Mesh(archGeo, mirrorGoldMat);
    archMesh.castShadow = true;
    topperGroup.add(archMesh);

    // Text ribbon plate: "Happy Birthday"
    const textPlateGeo = new THREE.BoxGeometry(2.3, 0.65, 0.06);
    const textPlateMesh = new THREE.Mesh(textPlateGeo, mirrorGoldMat);
    textPlateMesh.position.set(0, 1.7, 0);
    textPlateMesh.castShadow = true;
    topperGroup.add(textPlateMesh);

    // Gold Heart accent on top of the "H"
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.2, -0.25, 0.4, -0.25, 0.15);
    heartShape.bezierCurveTo(-0.25, -0.1, 0, -0.25, 0, -0.4);
    heartShape.bezierCurveTo(0, -0.25, 0.25, -0.1, 0.25, 0.15);
    heartShape.bezierCurveTo(0.25, 0.4, 0, 0.2, 0, 0);
    const heartExtrude = new THREE.ExtrudeGeometry(heartShape, { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
    const heartMesh = new THREE.Mesh(heartExtrude, mirrorGoldMat);
    heartMesh.rotation.z = Math.PI;
    heartMesh.position.set(-0.75, 2.45, 0.02);
    heartMesh.scale.set(0.65, 0.65, 0.65);
    heartMesh.castShadow = true;
    topperGroup.add(heartMesh);

    return topperGroup;
  }

  buildCake() {
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.position.set(0, -0.4, 0);
    this.scene.add(this.cakeGroup);

    // Luxury Materials
    const goldStandMat = new THREE.MeshStandardMaterial({
      color: 0xD6AD68,
      metalness: 0.92,
      roughness: 0.18,
    });

    const mirrorGoldMat = new THREE.MeshStandardMaterial({
      color: 0xFFE082,
      metalness: 0.96,
      roughness: 0.1,
    });

    const cakeButtercreamMat = new THREE.MeshStandardMaterial({
      map: createLuxuryCakeTexture(),
      bumpMap: createButtercreamBumpMap(),
      bumpScale: 0.035,
      roughness: 0.4,
      metalness: 0.08,
    });

    const cutInteriorMat = new THREE.MeshStandardMaterial({
      map: this.createLayeredCakeTexture(),
      roughness: 0.6,
      metalness: 0.05,
    });

    // ==========================================
    // 1. Polished Champagne-Gold Pedestal Stand
    // ==========================================
    const standGroup = new THREE.Group();

    // Round Beveled Base
    const baseGeo = new THREE.CylinderGeometry(2.1, 2.5, 0.25, 48);
    const baseMesh = new THREE.Mesh(baseGeo, goldStandMat);
    baseMesh.position.y = 0.125;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    standGroup.add(baseMesh);

    // Fluted Stem
    const stemGeo = new THREE.CylinderGeometry(0.55, 0.95, 1.1, 32);
    const stemMesh = new THREE.Mesh(stemGeo, goldStandMat);
    stemMesh.position.y = 0.78;
    stemMesh.castShadow = true;
    standGroup.add(stemMesh);

    // Stand Platter
    const platterGeo = new THREE.CylinderGeometry(3.3, 3.1, 0.18, 48);
    const platterMesh = new THREE.Mesh(platterGeo, goldStandMat);
    platterMesh.position.y = 1.42;
    platterMesh.receiveShadow = true;
    platterMesh.castShadow = true;
    standGroup.add(platterMesh);

    // Scalloped Gold Cake Board
    const boardGeo = new THREE.CylinderGeometry(3.05, 3.05, 0.12, 48);
    const boardMesh = new THREE.Mesh(boardGeo, goldStandMat);
    boardMesh.position.y = 1.57;
    standGroup.add(boardMesh);

    this.cakeGroup.add(standGroup);

    // ==========================================
    // 2. Wide Single-Tier Luxury Cylinder Cake
    // ==========================================
    const cakeRadius = 2.7;
    const cakeHeight = 2.2;
    const cakeY = 1.63 + cakeHeight / 2;

    const wedgeAngle = Math.PI / 4.5; // ~40 degree slice
    const startAngle = wedgeAngle / 2;
    const mainAngleLength = Math.PI * 2 - wedgeAngle;

    const mainCakeGroup = new THREE.Group();
    this.sliceGroup = new THREE.Group();

    this.cakeGroup.add(mainCakeGroup);
    this.cakeGroup.add(this.sliceGroup);

    // Main Cylinder Body
    const mainGeo = new THREE.CylinderGeometry(
      cakeRadius, cakeRadius, cakeHeight, 64, 1, false, startAngle, mainAngleLength
    );
    const mainMesh = new THREE.Mesh(mainGeo, cakeButtercreamMat);
    mainMesh.position.y = cakeY;
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    mainCakeGroup.add(mainMesh);

    // Cut Slice Wedge
    const sliceGeo = new THREE.CylinderGeometry(
      cakeRadius, cakeRadius, cakeHeight, 20, 1, false, -startAngle, wedgeAngle
    );
    const sliceMesh = new THREE.Mesh(sliceGeo, cakeButtercreamMat);
    sliceMesh.position.y = cakeY;
    sliceMesh.castShadow = true;
    sliceMesh.receiveShadow = true;
    this.sliceGroup.add(sliceMesh);

    // Cut Interior Walls (showing sponge layers)
    [-startAngle, startAngle].forEach((wallAngle, wIdx) => {
      const wallGeo = new THREE.PlaneGeometry(cakeRadius, cakeHeight);
      const wallMesh = new THREE.Mesh(wallGeo, cutInteriorMat);
      wallMesh.position.set(
        (cakeRadius / 2) * Math.cos(wallAngle),
        cakeY,
        (cakeRadius / 2) * Math.sin(wallAngle)
      );
      wallMesh.rotation.y = -wallAngle + (wIdx === 0 ? Math.PI / 2 : -Math.PI / 2);
      mainCakeGroup.add(wallMesh);
    });

    [-startAngle, startAngle].forEach((wallAngle, wIdx) => {
      const sliceWallGeo = new THREE.PlaneGeometry(cakeRadius, cakeHeight);
      const sliceWallMesh = new THREE.Mesh(sliceWallGeo, cutInteriorMat);
      sliceWallMesh.position.set(
        (cakeRadius / 2) * Math.cos(wallAngle),
        cakeY,
        (cakeRadius / 2) * Math.sin(wallAngle)
      );
      sliceWallMesh.rotation.y = -wallAngle + (wIdx === 0 ? -Math.PI / 2 : Math.PI / 2);
      this.sliceGroup.add(sliceWallMesh);
    });

    // ==========================================
    // 3. Top Rim Floral Decor, Roses, Gold Spheres
    // ==========================================
    const topY = cakeY + cakeHeight / 2;

    // Blush Pink Garden Roses
    const rose1 = this.create3DRoseMesh(0.55);
    rose1.position.set(-1.4, topY + 0.25, 0.7);
    rose1.rotation.set(0.3, -0.4, 0.2);
    mainCakeGroup.add(rose1);

    const rose2 = this.create3DRoseMesh(0.52);
    rose2.position.set(1.4, topY + 0.25, 0.6);
    rose2.rotation.set(0.35, 0.45, -0.2);
    mainCakeGroup.add(rose2);

    // White blossoms flanking roses
    const whiteF1 = this.create3DWhiteFlower(0.35);
    whiteF1.position.set(-1.85, topY + 0.15, 0.4);
    whiteF1.rotation.set(0.2, -0.7, 0.3);
    mainCakeGroup.add(whiteF1);

    const whiteF2 = this.create3DWhiteFlower(0.35);
    whiteF2.position.set(1.85, topY + 0.15, 0.3);
    whiteF2.rotation.set(0.2, 0.7, -0.3);
    mainCakeGroup.add(whiteF2);

    // Golden Wheat / Pampas fronds
    [-1.7, 1.7].forEach((fx, idx) => {
      const frondGeo = new THREE.ConeGeometry(0.18, 1.1, 8);
      const frondMesh = new THREE.Mesh(frondGeo, goldStandMat);
      frondMesh.position.set(fx, topY + 0.55, 0.1);
      frondMesh.rotation.z = idx === 0 ? 0.6 : -0.6;
      frondMesh.rotation.x = -0.3;
      frondMesh.castShadow = true;
      mainCakeGroup.add(frondMesh);
    });

    // Lustrous Mirror-Gold Spheres & Pearls (multiple sizes clustered on top & base)
    const spherePlacements = [
      // Top rim cluster
      { x: -0.85, y: topY + 0.18, z: 1.1, r: 0.22 },
      { x: -0.55, y: topY + 0.12, z: 1.3, r: 0.15 },
      { x: 0.75, y: topY + 0.2, z: 1.15, r: 0.24 },
      { x: 1.05, y: topY + 0.14, z: 1.35, r: 0.16 },
      { x: 0.4, y: topY + 0.1, z: 1.45, r: 0.12 },
      // Base board cluster
      { x: 2.4, y: 1.72, z: 1.2, r: 0.18 },
      { x: 2.1, y: 1.68, z: 1.45, r: 0.14 },
      { x: -2.3, y: 1.72, z: 1.2, r: 0.18 }
    ];

    spherePlacements.forEach(sp => {
      const sphereGeo = new THREE.SphereGeometry(sp.r, 16, 16);
      const sphereMesh = new THREE.Mesh(sphereGeo, mirrorGoldMat);
      sphereMesh.position.set(sp.x, sp.y, sp.z);
      sphereMesh.castShadow = true;
      mainCakeGroup.add(sphereMesh);
    });

    // Cream Dollops on top edge
    const dollopCount = 12;
    for (let i = 0; i < dollopCount; i++) {
      const angle = (i / dollopCount) * Math.PI * 2;
      const isSlice = (angle > (Math.PI * 2 - startAngle) || angle < startAngle);
      const dGeo = new THREE.SphereGeometry(0.12, 10, 10);
      const dMesh = new THREE.Mesh(dGeo, new THREE.MeshStandardMaterial({ color: 0xFFFCF7, roughness: 0.3 }));
      dMesh.scale.set(1, 0.7, 1);
      dMesh.position.set(Math.cos(angle) * (cakeRadius - 0.15), topY + 0.05, Math.sin(angle) * (cakeRadius - 0.15));
      if (isSlice) this.sliceGroup.add(dMesh);
      else mainCakeGroup.add(dMesh);
    }

    // ==========================================
    // 4. Mirror-Gold Calligraphy Cake Topper
    // ==========================================
    this.topperGroup = this.createMirrorGoldTopper();
    this.topperGroup.position.set(0, topY, 0);
    mainCakeGroup.add(this.topperGroup);

    // ==========================================
    // 5. Birthday Candle with Flickering Flame Light
    // ==========================================
    const candleGroup = new THREE.Group();
    candleGroup.position.set(0, topY, 0.65);

    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.75, 16);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.25 });
    const candleMesh = new THREE.Mesh(candleGeo, candleMat);
    candleMesh.position.y = 0.375;
    candleGroup.add(candleMesh);

    const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8);
    const wickMesh = new THREE.Mesh(wickGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
    wickMesh.position.y = 0.78;
    candleGroup.add(wickMesh);

    this.flameMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.28, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFAA22 })
    );
    this.flameMesh.position.y = 0.94;
    this.flameMesh.scale.set(0.001, 0.001, 0.001);
    candleGroup.add(this.flameMesh);

    this.candleLight = new THREE.PointLight(0xFFA834, 0, 5);
    this.candleLight.position.y = 0.96;
    candleGroup.add(this.candleLight);

    mainCakeGroup.add(candleGroup);

    // ==========================================
    // 6. Dessert Plate for Cut Slice
    // ==========================================
    this.plateGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.08, 36);
    const plateMesh = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({ color: 0xFFFAF5, roughness: 0.2 }));
    this.plateGroup.add(plateMesh);

    const plateRimGeo = new THREE.TorusGeometry(1.58, 0.04, 12, 48);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, goldStandMat);
    plateRimMesh.rotation.x = Math.PI / 2;
    this.plateGroup.add(plateRimMesh);

    this.plateGroup.position.set(0, 0.6, 4.2);
    this.plateGroup.visible = false;
    this.scene.add(this.plateGroup);

    // ==========================================
    // 7. Golden Cake Knife
    // ==========================================
    this.knifeGroup = new THREE.Group();
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.4, 1.8);
    bladeShape.lineTo(0.06, 3.4);
    bladeShape.lineTo(0, 3.4);
    bladeShape.closePath();

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
    const bladeMesh = new THREE.Mesh(bladeGeo, goldStandMat);
    bladeMesh.rotation.z = Math.PI;
    bladeMesh.position.set(0.2, 3.0, 0);
    this.knifeGroup.add(bladeMesh);

    const handleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.5, 16), goldStandMat);
    handleMesh.position.set(0, 3.8, 0);
    this.knifeGroup.add(handleMesh);

    this.knifeGroup.position.set(0, 8, 0);
    this.knifeGroup.visible = false;
    this.scene.add(this.knifeGroup);
  }

  // Light candle with spark
  lightCandlesSequence() {
    if (this.candleLit) return;
    this.candleLit = true;

    audioManager.playIgnite();
    if (this.flameMesh && this.candleLight) {
      let progress = 0;
      const lightInterval = setInterval(() => {
        progress += 0.15;
        const s = Math.min(1, progress);
        this.flameMesh.scale.set(s, s, s);
        this.candleLight.intensity = s * 2.2;
        if (progress >= 1) clearInterval(lightInterval);
      }, 20);
    }
  }

  // Cake-cutting animation
  cutTheCake(onComplete) {
    if (this.isCutting || this.isCut) return;
    this.isCutting = true;

    audioManager.playSliceSound();

    if (this.isFallback || !this.knifeGroup) {
      setTimeout(() => {
        this.isCut = true;
        this.isCutting = false;
        if (onComplete) onComplete();
      }, 1200);
      return;
    }

    this.knifeGroup.visible = true;
    this.knifeGroup.position.set(0, 6.8, 0.4);
    this.knifeGroup.rotation.set(0.3, 0, 0.1);

    this.cakeGroup.rotation.y = 0;
    this.rotationVelocityY = 0;

    let startTime = performance.now();
    const duration = 1100;

    const animateCut = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.knifeGroup.position.y = 6.8 - easeT * 4.0;
      this.knifeGroup.rotation.x = 0.3 - easeT * 0.15;

      if (t < 1) {
        requestAnimationFrame(animateCut);
      } else {
        setTimeout(() => {
          let retractStart = performance.now();
          const retractAnim = (rTime) => {
            const rElapsed = rTime - retractStart;
            const rt = Math.min(1, rElapsed / 450);
            this.knifeGroup.position.y = 2.8 + rt * 4.2;
            if (rt < 1) {
              requestAnimationFrame(retractAnim);
            } else {
              this.knifeGroup.visible = false;
              this.animateSliceSeparation(onComplete);
            }
          };
          requestAnimationFrame(retractAnim);
        }, 120);
      }
    };
    requestAnimationFrame(animateCut);
  }

  animateSliceSeparation(onComplete) {
    this.plateGroup.visible = true;
    this.plateGroup.position.set(0, 0.6, 4.0);

    let start = performance.now();
    const dur = 1300;

    const animSlice = (time) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / dur);
      const ease = 1 - Math.pow(1 - t, 3);

      this.sliceGroup.position.z = ease * 2.8;
      this.sliceGroup.position.y = -ease * 0.85;
      this.sliceGroup.position.x = ease * 0.45;
      this.sliceGroup.rotation.y = ease * 0.2;
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

  resetCelebration() {
    this.isCut = false;
    this.isCutting = false;
    this.plateGroup.visible = false;
    this.sliceGroup.position.set(0, 0, 0);
    this.sliceGroup.rotation.set(0, 0, 0);

    this.candleLit = false;
    if (this.flameMesh) this.flameMesh.scale.set(0.001, 0.001, 0.001);
    if (this.candleLight) this.candleLight.intensity = 0;

    setTimeout(() => this.lightCandlesSequence(), 300);
  }

  // Super Responsive Touch & Drag with Momentum Inertia
  setupTouchAndDrag() {
    const canvas = this.renderer.domElement;

    const handleDown = (x, y) => {
      this.isDragging = true;
      this.previousPointerPos = { x, y };
      this.rotationVelocityY = 0;
      this.rotationVelocityX = 0;
    };

    const handleMove = (x, y) => {
      if (!this.isDragging || this.isCutting) return;

      const deltaX = x - this.previousPointerPos.x;
      const deltaY = y - this.previousPointerPos.y;

      // Noticeable and immediate response
      this.rotationVelocityY = deltaX * 0.012;
      this.rotationVelocityX = deltaY * 0.008;

      this.cakeGroup.rotation.y += this.rotationVelocityY;
      this.cakeGroup.rotation.x = Math.max(-0.35, Math.min(0.45, this.cakeGroup.rotation.x + this.rotationVelocityX));

      this.previousPointerPos = { x, y };
    };

    const handleUp = () => {
      this.isDragging = false;
    };

    // Mouse Listeners
    canvas.addEventListener('mousedown', (e) => handleDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleUp);

    // Mobile Touch Listeners (Smooth one-finger drag)
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handleDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
  }

  // Super Responsive Device Tilt & Gyroscope Physics
  setupDeviceOrientation() {
    const motionBtn = document.getElementById('btn-enable-motion');

    const handleOrientation = (event) => {
      if (!this.deviceOrientationEnabled) return;

      // gamma: Left-to-right tilt in degrees [-90, 90]
      // beta: Front-to-back tilt in degrees [-180, 180] (normal holding ~45deg)
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;
      const normalizedBeta = beta - 45;

      // SUPER NOTICEABLE & VISIBLE PHYSICAL ROTATIONAL TILT:
      // Clamped and scaled to provide dramatic 3D perspective shift
      const clampedGamma = Math.max(-45, Math.min(45, gamma));
      const clampedBeta = Math.max(-45, Math.min(45, normalizedBeta));

      // 1. Direct rotational tilt of cake model (Up to ±25 degrees!)
      this.targetTiltZ = -(clampedGamma / 45) * 0.42; // roll left-right
      this.targetTiltY = (clampedGamma / 45) * 0.55;  // yaw left-right
      this.targetTiltX = (clampedBeta / 45) * 0.48;   // pitch forward-backward

      // 2. Dynamic camera position parallax shift (Moves up to 3.8 units!)
      const targetCamX = (clampedGamma / 45) * 3.6;
      const targetCamY = 3.8 - (clampedBeta / 45) * 2.6;
      const targetCamZ = 9.6 - Math.abs(clampedGamma / 45) * 0.9;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.14;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 0.14;
      this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.14;
      this.camera.lookAt(0, 2.0, 0);

      // 3. Shift key light position to sweep specular reflections across gold topper
      if (this.keyLight) {
        this.keyLight.position.x = 5 + (clampedGamma / 45) * 4;
      }
    };

    const activateMotion = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceOrientationEvent.requestPermission();
          if (permissionState === 'granted') {
            this.deviceOrientationEnabled = true;
            window.addEventListener('deviceorientation', handleOrientation, true);
            if (motionBtn) {
              motionBtn.innerHTML = '✓ 3D TILT ACTIVE (Tilt Phone!) 📱';
              motionBtn.classList.add('active');
            }
          }
        } catch (e) {
          console.warn('Motion permission error:', e);
        }
      } else if ('ondeviceorientation' in window) {
        this.deviceOrientationEnabled = true;
        window.addEventListener('deviceorientation', handleOrientation, true);
        if (motionBtn) {
          motionBtn.innerHTML = '✓ 3D TILT ACTIVE (Tilt Phone!) 📱';
          motionBtn.classList.add('active');
        }
      }
    };

    if (motionBtn) {
      motionBtn.addEventListener('click', () => {
        audioManager.playChime();
        activateMotion();
      });
    }

    // Auto-listen on standard Android/Chrome without blocking permission requirement
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      this.deviceOrientationEnabled = true;
      window.addEventListener('deviceorientation', handleOrientation, true);
      if (motionBtn) {
        motionBtn.innerHTML = '✓ 3D TILT ACTIVE (Tilt Phone!) 📱';
        motionBtn.classList.add('active');
      }
    }

    // Desktop pointer fallback tilt
    window.addEventListener('pointermove', (e) => {
      if (this.deviceOrientationEnabled) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      this.targetTiltY = normX * 0.45;
      this.targetTiltX = normY * 0.35;
      this.targetTiltZ = -normX * 0.2;

      this.camera.position.x = normX * 2.8;
      this.camera.position.y = 3.8 - normY * 1.8;
      this.camera.lookAt(0, 2.0, 0);
    }, { passive: true });
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

    // 1. Drag Momentum Inertia or Gentle Auto-Rotation
    if (!this.isDragging && !this.isCutting && !this.isCut) {
      if (Math.abs(this.rotationVelocityY) > 0.0002) {
        this.cakeGroup.rotation.y += this.rotationVelocityY;
        this.rotationVelocityY *= 0.95; // Smooth decay
      } else {
        this.cakeGroup.rotation.y += this.baseRotationSpeed;
      }

      if (Math.abs(this.rotationVelocityX) > 0.0002) {
        this.cakeGroup.rotation.x += this.rotationVelocityX;
        this.rotationVelocityX *= 0.93;
      }
    }

    // 2. Physical Cake Roll & Pitch Tilt Damping
    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.12;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.12;
    this.currentTiltZ += (this.targetTiltZ - this.currentTiltZ) * 0.12;

    this.cakeGroup.rotation.z = this.currentTiltZ;
    if (!this.isDragging) {
      this.cakeGroup.rotation.x = this.currentTiltX;
    }

    // 3. Flame & Candle Light Flicker
    if (this.candleLit && this.flameMesh) {
      const flicker = Math.sin(time * 20) * 0.15 + Math.cos(time * 28) * 0.1;
      this.flameMesh.scale.x = 1 + flicker;
      this.flameMesh.scale.z = 1 + flicker;
      this.flameMesh.scale.y = 1 - flicker * 0.5;

      if (this.candleLight) {
        this.candleLight.intensity = 2.0 + flicker * 0.8;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  renderCSSFallback() {
    this.isFallback = true;
    const stage = document.getElementById('cake-stage-container');
    if (!stage || stage.querySelector('.css-cake-fallback')) return;

    const fallback = document.createElement('div');
    fallback.className = 'css-cake-fallback';
    fallback.innerHTML = `
      <div class="css-cake-wrapper">
        <div class="css-cake-single-tier">
          <div class="css-topper">Happy Birthday</div>
          <div class="css-sash"></div>
        </div>
        <div class="css-stand"></div>
      </div>
    `;
    stage.appendChild(fallback);
  }
}

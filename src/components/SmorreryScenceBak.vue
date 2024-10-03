<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { J2000, SSS_TEXTURES, planets_const, sun } from "@/utils/SpaceScene/utils/smorrery_const.js";

let smallBodies = []; // 行星、小天體物件陣列
let orbitingObjects = []; // 行星、小天體物件陣列
let objectContainers = []; // 行星、小天體容器陣列
let objectOrbits = []; // 行星、小天體軌道陣列（預先計算）
let objectTraces = []; // 行星、小天體軌跡陣列
let objectLabels = []; // 行星、小天體標籤陣列

const J2000_DATE = new Date(Date.UTC(2000, 0, 1, 12, 0, 0)); // 2000-01-01 12:00 UTC
const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);
const spaceScale = 20;
const radiusScale = 0.5;
const target = ref();
let isPlaying = true;
let timeScale = 1;
let timeDirection = 1;
let currentDate = J2000_DATE;
let planets = planets_const

const initSence = () => {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 20, 50);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  target.value.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  target.value.appendChild(labelRenderer.domElement);

  const controls = new OrbitControls(camera, labelRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = spaceScale * 0.1;
  controls.maxDistance = spaceScale * 40;

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  /**
   * 三向軸
   */
  const addAxesArrows = () => {
    const arrowLength = spaceScale;
    const arrowHeadLength = 4;
    const arrowHeadWidth = 2;

    const origin = new THREE.Vector3(0, 0, 0);

    const xArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      origin,
      arrowLength,
      0xff0000,
      arrowHeadLength,
      arrowHeadWidth
    );
    const yArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      origin,
      arrowLength,
      0x00ff00,
      arrowHeadLength,
      arrowHeadWidth
    );
    const zArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      origin,
      arrowLength,
      0x0000ff,
      arrowHeadLength,
      arrowHeadWidth
    );

    // Set initial visibility to false
    xArrow.visible = false;
    yArrow.visible = false;
    zArrow.visible = false;

    scene.add(xArrow);
    scene.add(yArrow);
    scene.add(zArrow);
  };
  addAxesArrows();

  /**
   * 加入黃道
   */
  const addEclipticPlane = () => {
    const planeGeometry = new THREE.PlaneGeometry(1200, 1200);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
    });

    const eclipticPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    eclipticPlane.rotation.x = Math.PI / 2;

    eclipticPlane.visible = false;
    scene.add(eclipticPlane);
  };
  addEclipticPlane();

  /**
   * Add starry background
   */
  const createBackgroundSphere = () => {
    const loader = new THREE.TextureLoader();

    // 加載星空背景材質
    loader.load(SSS_TEXTURES.MILKY_WAY, function (texture) {
      const geometry = new THREE.SphereGeometry(1200, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });

      const backgroundSphere = new THREE.Mesh(geometry, material);
      scene.add(backgroundSphere);
    });
  };
  createBackgroundSphere();

  /**
   * 建立太陽
   */
  const createSun = () => {
    const geometry = new THREE.SphereGeometry(sun.radius, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(SSS_TEXTURES.SUN);
    const material = new THREE.MeshStandardMaterial({
      // color: 0xffff00,
      map: texture,
      roughness: 0.5, // Roughness -> non-reflective
      metalness: 0, // No metalness
      emissive: 0xffff00, // With self-illumination
      emissiveIntensity: 1.0,
      emissiveMap: texture,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    const container = new THREE.Object3D();
    container.add(mesh);
    scene.add(container);

    const label = addLabel(mesh, "Sun");
    scene.add(label);
    label.visible = false;

    objectContainers.push(container);
    objectLabels.push(label);

    sun.container = container;
    sun.label = label;

    console.log("Created Sun");
  };
  createSun();

  /**
   * 建立行星
   */
  orbitingObjects = [...planets, ...smallBodies];
  console.log(orbitingObjects);
  const createOrbitingObject = (obj) => {
    let material;
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(obj.radius * radiusScale, 32, 32);

    if (obj.category === "small body") {
      material = new THREE.MeshStandardMaterial({
        color: 0x404040,
      });
    } else {
      const texturePath = SSS_TEXTURES[obj.name.toUpperCase()];
      const texture = textureLoader.load(texturePath);
      material = new THREE.MeshStandardMaterial({
        //color: obj.color,
        map: texture,
        roughness: 0.5, // Roughness -> non-reflective
        metalness: 0, // No metalness
        emissive: 0x000000, // No self-illumination
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    const container = new THREE.Object3D();
    container.add(mesh);
    // const randomNumberX = Math.floor(Math.random() * 51); // for test
    // const randomNumberZ = Math.floor(Math.random() * 51); // for test

    scene.add(container);

    createOrbitLine(obj);

    if (obj.name.toUpperCase() === "SATURN") {
      createRing(obj.radius, 1.24, 2.27, container);
    }

    const label = addLabel(mesh, obj.name);
    obj.label = label;
    scene.add(label);
    label.visible = false;

    objectLabels.push(label);
    objectContainers.push(container);

    obj.container = container;
    obj.trace = [];
    obj.T = Math.sqrt(obj.a ** 3); // Orbital period; using Kepler's 3rd Law

    console.log("Created " + obj.name);
  };
  const createRing = (radius, innerScale, outerScale, container) => {
    // 創建土星環的幾何體
    const innerRadius = radius * innerScale * radiusScale;
    const outerRadius = radius * outerScale * radiusScale;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const textureLoader = new THREE.TextureLoader();

    const ringTexture = textureLoader.load(SSS_TEXTURES["SATURN_RING"]);

    // 創建土星環材質
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // 暫時用白色
      //map: ringTexture,
      side: THREE.DoubleSide, // 讓土星環的正反面都可見
      transparent: true, // 使用透明材質
    });

    // 創建土星環 Mesh
    const saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);

    // 將土星環繞著 X 軸旋轉 90 度，放在行星赤道平面上
    saturnRing.rotation.x = Math.PI / 2;

    // 將土星環添加到行星容器中
    container.add(saturnRing);
  };
  const createOrbitLine = (obj) => {
    const a = obj.a;
    const b = a * Math.sqrt(1 - obj.e ** 2); // Calculate semi-minor axis
    const curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      a,
      b, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    const orbitOpacity = obj.category === "small body" ? 0.5 : 1.0;
    const material = new THREE.LineBasicMaterial({
      color: obj.color,
      transparent: true, // 允許透明
      opacity: orbitOpacity, // 初始不透明
    });

    const orbit = new THREE.Line(geometry, material);

    const orbitContainer = new THREE.Object3D();
    orbitContainer.add(orbit);

    const rotationMatrix = new THREE.Matrix4();
    applyOrbitalRotations(rotationMatrix, obj.i, obj.Omega, obj.varpi);
    orbitContainer.applyMatrix4(rotationMatrix);

    orbitContainer.visible = false;
    scene.add(orbitContainer);
    objectOrbits.push(orbitContainer);
  };
  const applyOrbitalRotations = (
    rotationMatrix,
    i,
    Omega,
    varpi,
    activated = true
  ) => {
    // Step 1: Rotate by Ω (Longitude of Ascending Node) around Y axis
    rotationMatrix.makeRotationY(((Omega * Math.PI) / 180) * activated);

    // Step 2: Rotate by i (Inclination) around X axis
    const iMatrix = new THREE.Matrix4();
    iMatrix.makeRotationX(((i * Math.PI) / 180) * activated);
    rotationMatrix.multiply(iMatrix);

    // Step 3: Rotate by ω (Argument of Perihelion) around Y axis (within the orbital plane)
    const omega = varpi - Omega; // Calculate ω from ϖ (Longitude of Perihelion)
    const omegaMatrix = new THREE.Matrix4();
    omegaMatrix.makeRotationY(((omega * Math.PI) / 180) * activated);
    rotationMatrix.multiply(omegaMatrix);
  };
  orbitingObjects.forEach((obj) => {
    createOrbitingObject(obj);
  });

  /**
   * 加入太陽光線
   */
  const addSunLight = () => {
    // Create a directional light to represent the Sun
    const sunLight = new THREE.PointLight(0xffffff, 100, 1000); // White light with intensity 1, range 1000 units
    sunLight.position.set(0, 0, 0); // Position the light at the origin
    sunLight.castShadow = false; // Enable shadows if needed

    scene.add(sunLight);
  };
  //addSunLight();

  /**
   * 環境光
   */
  const addAmbientLight = () => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.05); // Soft white light with lower intensity
    scene.add(ambientLight);
  };
  //addAmbientLight();

  /**
   * UI 控制項
   */
  //   const setupControls = () => {
  //     const showOrbitsCheckbox = document.getElementById("showOrbits");
  //     const showLabelsCheckbox = document.getElementById("showLabels");
  //     const showAxesCheckbox = document.getElementById("showAxes");
  //     const showEclipticCheckbox = document.getElementById("showEcliptic");
  //     const clearTracesButton = document.getElementById("clearTraces");

  //     // Toggle visibility of orbits
  //     showOrbitsCheckbox.addEventListener("change", (event) => {
  //       objectOrbits.forEach((orbit) => (orbit.visible = event.target.checked));
  //     });

  //     // Toggle visibility of labels
  //     showLabelsCheckbox.addEventListener("change", (event) => {
  //       showLabels = event.target.checked; // 更新 showLabels 狀態
  //       celestialObjects.forEach((obj) => {
  //         if (obj.label) {
  //           obj.label.visible = showLabels; // 根據狀態顯示或隱藏 label
  //         }
  //       });
  //     });

  //     // Toggle visibility of axes
  //     showAxesCheckbox.addEventListener("change", (event) => {
  //       toggleAxes(event.target.checked);
  //     });

  //     // Toggle visibility of ecliptic plane
  //     showEclipticCheckbox.addEventListener("change", (event) => {
  //       toggleEclipticPlane(event.target.checked);
  //     });

  //     // Clear all traces
  //     clearTracesButton.addEventListener("click", () => {
  //       clearTraces();
  //     });
  //   };
  //   setupControls();

  /**
   * UI 時間控制項
   */
  //   function setupTimeControls() {
  //     const playPauseButton = document.getElementById("playPause");
  //     const goToJ2000Button = document.getElementById("goToJ2000");
  //     const goToTodayButton = document.getElementById("goToToday");
  //     const speedSlider = document.getElementById("speedSlider");
  //     const speedValue = document.getElementById("speedValue");
  //     const setSpeedOneButton = document.getElementById("setSpeedOne");
  //     const reverseButton = document.getElementById("reverse");

  //     // Update button icon and title
  //     function updateButton(
  //       button,
  //       condition,
  //       titleTrue,
  //       titleFalse,
  //       iconTrue,
  //       iconFalse
  //     ) {
  //       button.title = condition ? titleTrue : titleFalse;
  //       if (iconTrue && iconFalse) {
  //         button.innerHTML = condition ? iconTrue : iconFalse;
  //       }
  //     }

  //     // Toggle play/pause state and update the button
  //     function togglePlayPause() {
  //       isPlaying = !isPlaying;
  //       updateButton(
  //         playPauseButton,
  //         isPlaying,
  //         "Pause",
  //         "Play",
  //         '<i class="fas fa-pause"></i>',
  //         '<i class="fas fa-play"></i>'
  //       );
  //     }

  //     // Toggle reverse and update time acceleration
  //     function toggleReverse() {
  //       timeDirection *= -1;
  //       reverseButton.classList.toggle("reversed");
  //       updateSpeedDisplay();
  //       clearTraces();
  //       updateButton(
  //         reverseButton,
  //         timeDirection == 1,
  //         "Play backward",
  //         "Play forward"
  //       );
  //     }

  //     // Handle general button events
  //     function handleButtonHover(button, title) {
  //       button.addEventListener("mouseenter", () => (button.title = title));
  //     }

  //     // Setup controls
  //     playPauseButton.addEventListener("click", togglePlayPause);

  //     reverseButton.addEventListener("click", toggleReverse);

  //     goToJ2000Button.addEventListener("click", () => {
  //       currentDate = new Date(J2000_DATE.getTime());
  //       console.log(currentDate);
  //       updateDateDisplay();
  //       clearTraces();
  //       updatePositions();
  //     });

  //     goToTodayButton.addEventListener("click", () => {
  //       currentDate = new Date();
  //       console.log(currentDate);
  //       updateDateDisplay();
  //       clearTraces();
  //       updatePositions();
  //     });

  //     speedSlider.addEventListener("input", () => {
  //       const sliderValue = parseFloat(speedSlider.value);
  //       timeScale = Math.pow(10, sliderValue);
  //       updateSpeedDisplay();
  //     });

  //     setSpeedOneButton.addEventListener("click", () => {
  //       timeScale = 1;
  //       speedSlider.value = 0;
  //       updateSpeedDisplay();
  //     });

  //     // Set hover titles
  //     updateButton(
  //       playPauseButton,
  //       isPlaying,
  //       "Pause",
  //       "Play",
  //       '<i class="fas fa-pause"></i>',
  //       '<i class="fas fa-play"></i>'
  //     );
  //     handleButtonHover(
  //       reverseButton,
  //       timeDirection ? "Play backward" : "Play forward"
  //     );
  //     handleButtonHover(goToJ2000Button, "Go to J2000");
  //     handleButtonHover(goToTodayButton, "Go to today");
  //     handleButtonHover(setSpeedOneButton, "Set speed to 1.00x");

  //     // Update speed display
  //     function updateSpeedDisplay() {
  //       speedValue.textContent = timeScale.toFixed(2) + "x";
  //     }

  //     updateDateDisplay();
  //   }
  //   setupTimeControls();

  /**
   * 動畫
   */
  const animate = () => {
    requestAnimationFrame(animate);

    if (isPlaying) {
      const oneFrameInMilliseconds = timeScale * 24 * 60 * 60 * 1000;

      if (timeDirection > 0) {
        currentDate.setTime(currentDate.getTime() + oneFrameInMilliseconds);
      } else {
        currentDate.setTime(currentDate.getTime() - oneFrameInMilliseconds);
      }

      if (currentDate < MIN_DATE) {
        currentDate = new Date(MAX_DATE);
      } else if (currentDate > MAX_DATE) {
        currentDate = new Date(MIN_DATE);
      }

      //   updateDateDisplay();
      updatePositions();
    }

    // controls.update();
    renderer.render(scene, camera);
    // labelRenderer.render(scene, camera);
  };
  function updatePositions() {
    const currentJulianDate = calculateJulianDate(currentDate);
    const yearSinceJ2000 = (currentJulianDate - J2000) / 365.25;

    orbitingObjects.forEach((obj) => {
      // Calculate Mean Anomaly (M), Eccentric Anomaly (E), True Anomaly (ν)
      const M = updateMeanAnomaly(obj.T, obj.ma, yearSinceJ2000);
      const E = solveKeplerEquation(obj.e, M);
      const nu = getTrueAnomaly(obj.e, E);

      // Calculate radial distance (r)
      const r =
        (spaceScale * obj.a * (1 - obj.e ** 2)) / (1 + obj.e * Math.cos(nu));

      // Calculate coordinates in the orbital plane
      const x = r * Math.cos(nu);
      const z = -r * Math.sin(nu);

      // Apply orbital rotations (Ω, i, ϖ)
      const rotationMatrix = new THREE.Matrix4();
      applyOrbitalRotations(rotationMatrix, obj.i, obj.om, obj.varpi);

      // Create a position vector and rotate it
      const positionVector = new THREE.Vector3(x, 0, z);
      positionVector.applyMatrix4(rotationMatrix);

      obj.container.position.set(
        positionVector.x,
        positionVector.y,
        positionVector.z
      );
      obj.container.updateMatrixWorld(true); // 確保更新應用到場景
      obj.label.position.set(
        positionVector.x,
        positionVector.y + obj.radius + 0.5,
        positionVector.z
      );

      // Add a segment to the trace
      obj.trace.push(
        new THREE.Vector3(positionVector.x, positionVector.y, positionVector.z)
      );
      drawTrace(obj);
    });
  }
  function drawTrace(obj) {
    // 移除舊的軌跡線
    if (obj.traceLine) {
      scene.remove(obj.traceLine);
    }

    // 創建新的軌跡線
    const traceGeometry = new THREE.BufferGeometry().setFromPoints(obj.trace);
    const traceMaterial = new THREE.LineBasicMaterial({
      color: obj.color,
      transparent: true, // 允許透明
      opacity: obj.category === "small body" ? 0.3 : 1.0, // 初始不透明度
    });

    const traceLine = new THREE.Line(traceGeometry, traceMaterial);
    scene.add(traceLine);

    // 儲存新軌跡線
    obj.traceLine = traceLine;
  }
  function clearTraces() {
    orbitingObjects.forEach((obj) => {
      // Clear the path array
      obj.trace = [];

      // Remove the existing path line from the scene
      if (obj.traceLine) {
        scene.remove(obj.traceLine);
        obj.traceLine = null; // Reset the path line reference
      }
    });
  }

  animate();
};

function addLabel(object, name) {
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.textContent = name;
  const label = new CSS2DObject(labelDiv);
  label.position.set(0, object.geometry.parameters.radius + 0.5, 0);
  object.add(label);
  return label;
}

function calculateJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}
function updateMeanAnomaly(T, M, time) {
  const n = (2 * Math.PI) / T; // Mean motion (rad per unit time)
  const newM = M + n * time; // New Mean anomaly
  return newM % (2 * Math.PI); // Ensure it stays within 0 to 2π
}

function getTrueAnomaly(e, E) {
  return (
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )
  );
}

function solveKeplerEquation(e, M) {
  let E = M; // Initial guess for Eccentric Anomaly (in radians)
  const tolerance = 1e-6;
  let delta = 1;

  // Newton-Raphson iteration to solve Kepler's Equation: M = E - e * sin(E)
  while (Math.abs(delta) > tolerance) {
    delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E = E - delta;
  }

  return E; // Eccentric Anomaly (in radians)
}
onMounted(() => {
  initSence();
});
</script>

<template>
  <div ref="target"></div>
</template>

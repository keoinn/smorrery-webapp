import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
  BackSide,
  Object3D,
  Vector3,
  RingGeometry,
  TorusGeometry,
  DoubleSide,
  BufferAttribute,
  LineBasicMaterial,
  BufferGeometry,
  Line,
} from "three";

import {
  SUN_INFO,
  planets_const,
  SSS_TEXTURES,
  J2000,
  radiusScale,
  spaceScale,
  MAX_TRACE_STEPS,
} from "@/utils/SpaceScene/utils/smorrery_const.js";
import {
  updateMeanAnomaly,
  calcEccentricAnomaly,
  calcTrueAnomaly,
  calcRadialDistance,
  polarToCartesian3D,
  calcOrbitalPeroid,
  calcPosition,
} from "@/utils/SpaceScene/utils/calculator.js";

function createMaterial(texture_img, type = "planets") {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(texture_img);
  let material;

  if (type == "background") {
    material = new MeshStandardMaterial({
      map: texture,
      side: BackSide,
      metalness: 0,
      emissive: 0x404040, // With self-illumination
      emissiveIntensity: 1.0,
      emissiveMap: texture,
    });
  } else if (type == "orbit") {
    material = new MeshStandardMaterial({
      map: texture,
      //   metalness: 0,
      roughness: 0.6, // Roughness -> non-reflective
      metalness: 0, // No metalness
      //   emissive: 0x404040, // No self-illumination
    });
  } else {
    material = new MeshStandardMaterial({
      map: texture,
      roughness: 0, // Roughness -> non-reflective
      metalness: 0, // No metalness
      emissive: 0xffff00, // With self-illumination
      emissiveIntensity: 1.0,
      emissiveMap: texture,
    });
  }

  return material;
}

function createBackgroundSphere() {
  const geometry = new SphereGeometry(1200, 60, 40);
  const material = createMaterial(SSS_TEXTURES["MILKY_WAY"], "background");
  const BackgroundSphere = new Mesh(geometry, material);

  return BackgroundSphere;
}

function createSun() {
  const geometry = new SphereGeometry(SUN_INFO.radius * radiusScale, 32, 32);
  const material = createMaterial(SSS_TEXTURES["SUN"]);

  const sun = new Mesh(geometry, material);
  sun.castShadow = false;
  sun.receiveShadow = true;

  return sun;
}

function createTraceLine(obj) {
  const traceGeometry = new BufferGeometry().setFromPoints(obj.trace);
  const traceMaterial = new LineBasicMaterial({
        color: obj.color,
        transparent: true, // 允許透明
        opacity: obj.category === 'small body' ? 0.3 : 1.0    // 初始不透明度
    });
  return new Line(traceGeometry, traceMaterial);
}

function createOrbitingObject(obj) {
  // 物體幾何
  const geometry = new SphereGeometry(obj.radius * radiusScale, 32, 32);
  const material = createMaterial(
    SSS_TEXTURES[obj.name.toUpperCase()],
    "orbit"
  );

  const orbit_container = new Object3D();
  const orbit = new Mesh(geometry, material);
  orbit.castShadow = false;
  orbit.receiveShadow = true;

  orbit_container.add(orbit);

  if (obj.name.toUpperCase() === "SATURN") {
    createRing(obj.radius, 1.24, 2.27, orbit_container);
  }

  // 起始位置
  obj.T = calcOrbitalPeroid(obj.a);
  obj.isTrace = false;
  obj.trace = [];
  obj.traceLine = createTraceLine(obj);

  /* BEING CONST SITE */
  const { a, e, i, om, varpi, ma } = obj;
  const orbitalElements = { a, e, i, om, varpi, ma };
  const period = obj.T;
  // Goals: 
  // const {radius, period, orbitalElements, container, label} = object;
  // const {a, e, i, om, varpi, ma} = orbitalElements;
  /* END CONST SITE */

  // Place the container at its initial position
  const initPosition = calcPosition(0, orbitalElements, spaceScale);
  orbit_container.position.copy(initPosition);

  // Update the container's position for the next frame
  orbit_container.tick = (delta, scene) => {
    const newPosition = calcPosition(delta, orbitalElements, spaceScale);
    orbit_container.position.copy(newPosition);

    // Add a new position to the trace if the object has tracing enabled
    if ( obj.isTrace ) {
      obj.trace.push(newPosition); // Add the current position to the trace
      if ( obj.trace.length >= MAX_TRACE_STEPS ){
        obj.trace.shift(); // Remove the oldest position to keep trace size fixed
      }
    }
    
    // Update the visual representation of the trace
    scene.remove(obj.traceLine);
    if(obj.trace.length > 0) {
      obj.traceLine = createTraceLine(obj); // Create a new trace line based on updated positions
      scene.add(obj.traceLine);  // Add the new trace line to the scene
    }
  };

  return orbit_container;
}

const createRing = (radius, innerScale, outerScale, container) => {
  // 創建土星環的幾何體
  const innerRadius = radius * innerScale * radiusScale;
  const outerRadius = radius * outerScale * radiusScale;

  const ringGeometry = new RingGeometry(innerRadius, outerRadius, 64);
  // 紋理座標定位
  const pos = ringGeometry.attributes.position;
  const vector3_cal = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    vector3_cal.fromBufferAttribute(pos, i);
    ringGeometry.attributes.uv.setXY(i, vector3_cal.length() < 6 ? 0 : 1, 1);
  }

  // 創建土星環材質
  const textureLoader = new TextureLoader();
  const ringTexture = textureLoader.load(SSS_TEXTURES["SATURN_RING"]);
  //需要光線呈現改用 MeshStandardMaterial 建立材質
  const ringMaterial = new MeshBasicMaterial({
    map: ringTexture,
    color: 0xffffff,
    side: DoubleSide, // 讓土星環的正反面都可見
    transparent: true, // 使用透明材質
  });

  // 創建土星環 Mesh
  const saturnRing = new Mesh(ringGeometry, ringMaterial);

  // 將土星環繞著 X 軸旋轉 90 度，放在行星赤道平面上
  saturnRing.rotation.x = Math.PI / 2;

  // 將土星環添加到行星容器中
  container.add(saturnRing);
};

export { createBackgroundSphere, createSun, createOrbitingObject, createRing };

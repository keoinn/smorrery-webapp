import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
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
  Euler
} from "three";

import {
  SUN_DATA,
  PLANETS_DATA,
  SSS_TEXTURES,
  J2000,
  RADIUS_SCALE,
  SPACE_SCALE,
  MAX_TRACE_STEPS,
} from "@/utils/SpaceScene/utils/constants.js";

import { calcOrbitalPeroid, calcPosition } from "@/utils/SpaceScene/utils/calculator.js";


const backgroundRadius = 1200;
const backgroundTexturePath = SSS_TEXTURES["MILKY_WAY"];
const sunTexture = SSS_TEXTURES['SUN'];

function selectMaterial(texturesPath, category, altColor = 0xffffff) { 
  const texture = texturesPath ? new TextureLoader().load(texturesPath) : null;
  let material;

  if (category === 'planet' ) { // No texture for small bodies
    material = new MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
    });
  } else if (category === 'sun') { // Self-illumination for stars (e.g., Sun)
    material = new MeshStandardMaterial({
      map: texture,              
      roughness: 0,
      metalness: 0,
      emissive: 0xffff00,     // Strong Self-illumination
      emissiveIntensity: 1.0,     
      emissiveMap: texture        
    });
  } else if (category === 'background') { // Self-illumination for backgrounds
    material = new MeshStandardMaterial({
      map: texture,    
      roughness: 0,
      metalness: 0,
      side: BackSide,
      emissive: 0x404040,     // Weak Self-illumination
      emissiveIntensity: 0.5,     
      emissiveMap: texture        
    }); 
  } else {
    material = new MeshStandardMaterial({
      color: altColor,
      roughness: 0.5,
      metalness: 0,
      emissive: 0x000000 
    });
  }

  // Create and return the material with the final options
  return material;
}


function createMaterial(texturePath, type = "planets") {
  const texture = new TextureLoader().load(texturePath);
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

/**
 * Create a spherical background with a texture. 
 * The radius (`backgroundRadius`) and texture path (`backgroundTexturePath`) are specified as global constants.
 * This function applies galactic-to-ecliptic rotation sto the background sphere.
 * 
 * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
 */
function createBackground() {
  console.log(`Background radius is ${backgroundRadius}`);

  const geometry = new SphereGeometry(backgroundRadius, 60, 40);
  const material = selectMaterial(backgroundTexturePath, "background");
  const backgroundSphere = new Mesh(geometry, material);
  
  // Apply Galactic-to-Ecliptic Rotations
  const eulerAngles = new Euler(62.87 / 180 * Math.PI, 0, -282.86 / 180 * Math.PI);
  backgroundSphere.quaternion.setFromEuler(eulerAngles);

  return backgroundSphere;
}

function createSun() {
  const geometry = new SphereGeometry(SUN_DATA.radius * RADIUS_SCALE, 32, 32);
  const material = selectMaterial(sunTexture, 'sun');

  const sun = new Mesh(geometry, material);

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
  const { name, radius, orbitalElements, category } = obj;

  const geometry = new SphereGeometry(radius * RADIUS_SCALE, 32, 32);
  const material = selectMaterial(SSS_TEXTURES[name.toUpperCase()], category);

  const container = new Object3D();
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  container.add(mesh);

  obj.period = calcOrbitalPeroid(obj.orbitalElements.a);
  obj.isTrace = false;
  obj.trace = [];
  obj.traceLine = createTraceLine(obj);

  if (name.toUpperCase() === "SATURN") {
    createRing(radius, 1.24, 2.27, container);
  }

  // Place the container at its initial position
  const initPosition = calcPosition(0, orbitalElements, obj.period, SPACE_SCALE);
  container.position.copy(initPosition);

  // Update the container's position for the next frame
  container.tick = (delta, scene) => {
    const newPosition = calcPosition(delta, orbitalElements, obj.period, SPACE_SCALE);
    container.position.copy(newPosition);

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

  return container;
}

const createRing = (radius, innerScale, outerScale, container) => {
  // 創建土星環的幾何體
  const innerRadius = radius * innerScale * RADIUS_SCALE;
  const outerRadius = radius * outerScale * RADIUS_SCALE;

  const ringGeometry = new RingGeometry(innerRadius, outerRadius, 64);
  // 紋理座標定位
  const pos = ringGeometry.attributes.position;
  const vector3_cal = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    vector3_cal.fromBufferAttribute(pos, i);
    ringGeometry.attributes.uv.setXY(i, vector3_cal.length() < 6 ? 0 : 1, 1);
  }

  // 創建土星環材質
  const ringTexture = new TextureLoader().load(SSS_TEXTURES["SATURN_RING"]);
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

export { createBackground, createSun, createOrbitingObject, createRing };

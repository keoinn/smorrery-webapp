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
  solveKeplerEquation,
  getTrueAnomaly,
  getRadualDistance,
  getCoordinateOrbitalPlane,
  getOrbitalPeroid,
  updateOrbitaPostion,
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
  obj.T = getOrbitalPeroid(obj.a);
  obj.trace = [];
  obj.traceLine = createTraceLine(obj)
  const _M = updateMeanAnomaly(obj.T, obj.ma, 0);
  const _E = solveKeplerEquation(obj.e, _M);
  const _nu = getTrueAnomaly(obj.e, _E);
  const _r = getRadualDistance(spaceScale, obj.a, obj.e, _nu);
  const [_x, _y, _z] = getCoordinateOrbitalPlane(_r, _nu);
  const orbit_pos = new Vector3(_x, _y, _z);
  /* Test for Random Postion 
  const orbit_pos = new Vector3(
    Math.floor(Math.random() * 51),
    0,
    Math.floor(Math.random() * 51),
    ) 
  */
  orbit_container.position.copy(orbit_pos);
  /* Test for SATURN Postion 
  if (obj.name.toUpperCase() === "SATURN") {
    orbit_container.position.copy(new Vector3(10, 0, 23));
  }*/

  // 運動 frame 計算
  orbit_container.tick = (delta, scene) => {
    const [_x, _y, _z] = updateOrbitaPostion(getOrbitalPeroid(obj.a), obj.ma, obj.e, obj.a ,spaceScale, delta)
    const orbit_update_pos = new Vector3(_x, _y, _z);
    orbit_container.position.copy(orbit_update_pos)

    // 軌跡
    // Add a segment to the trace
    obj.trace.push(orbit_update_pos);
    if(obj.trace.length >= MAX_TRACE_STEPS){
      obj.trace.shift()
    }

    // 顯示
    scene.remove(obj.traceLine)
    obj.traceLine = createTraceLine(obj)
    scene.add(obj.traceLine)
    
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

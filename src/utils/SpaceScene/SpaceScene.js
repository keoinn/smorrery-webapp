import { createScene } from "./components/scene.js";
import { createRenderer, createLabelRenderer } from "./core/renderer.js";
import { createCamera } from "./components/camera.js";
import { Loop } from "./core/loop.js";
import { createCube } from "./components/cube.js";
import { createLights } from "./components/lights.js";
import { createControls } from "./core/controls.js";
import { Resizer } from "./core/Resizer.js";
import { Object3D } from "three";
import {
  createBackgroundSphere,
  createSun,
  createOrbitingObject,
  createRing,
} from "./components/objects.js";

import { planets_const, J2000 } from "@/utils/SpaceScene/utils/smorrery_const.js";

let scene;
let camera;
let renderer;
let labelRender;

let loop;
let currentDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
let timeDirection = 1
let timeScale = 1

let container_width = window.innerWidth;
let container_height = window.innerHeight;

let smallBodies = [];
let orbitingObjects = [];

class SpaceScene {
  constructor(container) {
    container_width = window.innerWidth;
    container_height = window.innerHeight;

    // 初始建構
    scene = createScene();
    renderer = createRenderer(container_width, container_height);
    labelRender = createLabelRenderer(container_width, container_height);
    camera = createCamera(container_width, container_height);
    loop = new Loop(camera, scene, renderer, timeScale, currentDate, timeDirection);

    // 添加畫布
    container.append(renderer.domElement);
    container.append(labelRender.domElement);

    // 畫面控制器
    const controls = createControls(camera, labelRender.domElement);
    loop.updatables.push(controls);

    const { ambientLight, sunLight } = createLights();
    // 背景
    const backgroundSphere = createBackgroundSphere();
    scene.add(ambientLight, backgroundSphere);

    // 物件
    const sun = createSun();

    // 行星
    orbitingObjects = [...planets_const, ...smallBodies];
    orbitingObjects.forEach((obj) => {
      obj.container = createOrbitingObject(obj);
      loop.updatables.push(obj.container)
      scene.add(obj.container);
    });
    console.log(orbitingObjects);

    scene.add(sun);
    scene.add(ambientLight);
    scene.add(sunLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }
  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { SpaceScene };

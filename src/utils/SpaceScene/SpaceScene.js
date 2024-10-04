import { createLights } from "./components/lights.js";
import { Resizer } from "./core/Resizer.js";
import {
  createBackgroundSphere,
  createSun,
  createOrbitingObject,
} from "./components/objects.js";

import { planets_const } from "@/utils/SpaceScene/utils/smorrery_const.js";
import { EmptyScene } from "./EmptyScene.js";

class SpaceScene extends EmptyScene {
  constructor(container) {
    super(container);

    const { ambientLight, sunLight } = createLights();
    // 背景
    const backgroundSphere = createBackgroundSphere();
    this.scene.add(ambientLight, backgroundSphere);
    // 物件
    const sun = createSun();

    this.smallBodies = [];
    // 行星
    this.orbitingObjects = [...planets_const, ...this.smallBodies];
    this.orbitingObjects.forEach((obj) => {
      obj.container = createOrbitingObject(obj);
      this.loop.updatables.push(obj.container);
      this.scene.add(obj.container);
    });
    console.log(this.orbitingObjects);

    this.scene.add(sun);
    this.scene.add(ambientLight);
    this.scene.add(sunLight);

    const resizer = new Resizer(container, this.camera, this.renderer);

  }

  clearTrace() {
    this.orbitingObjects.forEach(obj => {
      obj.trace = []
    })
  }

  // 天體軌跡記錄啟動
  set OrbitingRecordTrace (flag) {
    const st = (flag === true)? true : false;
    this.orbitingObjects.forEach(obj => {
      obj.isTrace = st
      if(!st) {
        obj.trace = []
      }
    })
  }

}

export { SpaceScene };

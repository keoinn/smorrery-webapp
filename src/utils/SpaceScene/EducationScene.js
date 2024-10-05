import { createLights } from "./components/lights.js";
import {
  createBackgroundSphere,
  createSun,
  createOrbitingObject,
} from "./components/objects.js";

import { planets_const } from "@/utils/SpaceScene/utils/smorrery_const.js";
import { EmptyScene } from "./EmptyScene.js";

//TODO: add camera movement
class EducationScene extends EmptyScene {
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

    // group by category
    this.availableObjects = {};
    this.orbitingObjects.forEach((obj) => {
      if (!this.availableObjects[obj.category]) {
        this.availableObjects[obj.category] = [];
      }
      this.availableObjects[obj.category].push(obj.name);
    });

    // all 3D objects in scene
    this.objects3d = [];

    this.scene.add(sun);
    this.scene.add(ambientLight);
    this.scene.add(sunLight);

    this.customTickFunctions = [];

    this.customUpdatable = {
      tick: (delta, scene) => {
        const currentDate = this.loop.currentDate;
        for (const func of this.customTickFunctions) {
          func(delta, scene, currentDate);
        }
      },
    };
    this.loop.updatables.push(this.customUpdatable);

    this.loop.played = 1; // 是否計算下一幀差異
  }

  addCelestialBody(bodyName) {
    const body = this.orbitingObjects.find((obj) => obj.name === bodyName);
    if (body) {
      const orbitingObject = createOrbitingObject(body);
      this.scene.add(orbitingObject);
      this.loop.updatables.push(orbitingObject);
      this.objects3d.push(orbitingObject);
      orbitingObject.name = bodyName;
    }
  }

  removeCelestialBody(bodyName) {
    const body = this.orbitingObjects.find((obj) => obj.name === bodyName);
    if (body) {
      const body3d = this.objects3d.find((obj) => obj.name === bodyName);
      this.scene.remove(body3d);
      this.objects3d = this.objects3d.filter((obj) => obj !== body3d);
      this.loop.updatables = this.loop.updatables.filter(
        (obj) => obj !== body3d
      );
      this.scene.remove(body.traceLine);
    }
  }

  removeAllCelestialBodies() {
    this.orbitingObjects.forEach((obj) => this.removeCelestialBody(obj.name));
  }

  addCustomTickFunction(func) {
    this.customTickFunctions.push(func);
  }

  removeCustomTickFunction(func) {
    const index = this.customTickFunctions.indexOf(func);
    if (index !== -1) {
      this.customTickFunctions.splice(index, 1);
    }
  }

  clearCustomTickFunctions() {
    this.customTickFunctions = [];
  }
}

export { EducationScene };

import { EmptyScene } from "./EmptyScene.js";
import { CelestialBody, createBackground } from "./components/objects.js";
import { createLightSource } from "./components/light.js";
import { SUN_DATA, PLANETS_DATA, SSS_TEXTURES } from "./utils/constants.js";

//TODO: add camera movement
class EducationScene extends EmptyScene {
  constructor(container) {
    super(container);

    // Stage props for the scene
    const backgroundSphere = createBackground();
    const sunLight = createLightSource("sun");
    const backgroundLight = createLightSource("ambient");

    [sunLight, backgroundLight, backgroundSphere].forEach((stageProp) => {
      this.scene.add(stageProp);
    });

    // Celestial objects
    const sun = new CelestialBody(this.scene, SUN_DATA);
    this.scene.add(sun.container);

    this.smallBodies = [];
    // 行星
    this.orbitingObjects = [...PLANETS_DATA, ...this.smallBodies];

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
      const orbitingObject = new CelestialBody(this.scene, body);
      const container = orbitingObject.container
      this.scene.add(container);
      this.loop.updatables.push(container);
      this.objects3d.push(container);
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

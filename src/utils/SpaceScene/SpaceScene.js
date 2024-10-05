import { createLightSource } from "./components/light.js";
import { Resizer } from "./core/Resizer.js";
import {
  createBackground,
  createSun,
  createOrbitingObject,
} from "./components/objects.js";

import { PLANETS_DATA } from "@/utils/SpaceScene/utils/constants.js";
import { EmptyScene } from "./EmptyScene.js";

const CelestialObjects = []; // FOR UNIFIED MANAGEMENT  // TO DO: INSERT CELESTIAL OBJECT DATA

class SpaceScene extends EmptyScene {
  constructor(container) {
    super(container);

    // Stage props for the scene
    const backgroundSphere = createBackground();
    const sunLight = createLightSource('sun');
    const backgroundLight = createLightSource('ambient');
    
    [ sunLight, backgroundLight, backgroundSphere ].forEach(stageProp => {
      this.scene.add(stageProp);
    })

    // Celestial objects
    const sun = createSun();
    this.scene.add(sun);

    this.smallBodies = []; // TO DO: INSERT SMALL BODY DATA

    this.orbitingObjects = [...PLANETS_DATA, ...this.smallBodies];
    this.orbitingObjects.forEach((obj) => {
      obj.container = createOrbitingObject(obj);
      this.loop.updatables.push(obj.container);
      this.scene.add(obj.container);
    });
    
    console.log(this.orbitingObjects);

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

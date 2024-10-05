import { EmptyScene } from "./EmptyScene.js";
import { createLightSource } from "./components/light.js";
import { createBackground, CelestialBody } from "./components/objects.js";
import { SUN_DATA, PLANETS_DATA, SSS_TEXTURES } from "./utils/constants.js";
import { Resizer } from "./core/Resizer.js";

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
    const sun = new CelestialBody(this.scene, SUN_DATA, SSS_TEXTURES);
    this.scene.add(sun.container);
    console.log(sun);

    this.smallBodies = []; // TO DO: INSERT SMALL BODY DATA

    this.orbitingObjectsData = PLANETS_DATA //[...PLANETS_DATA, ...this.smallBodies]; <-- TEST
    this.orbitingObjectsData.forEach((data) => {
      const body = new CelestialBody(this.scene, data, SSS_TEXTURES);
      console.log(body);
      this.scene.add(body.container);
      this.loop.updatables.push(body.container);

      CelestialObjects.push(body);
    });

    // console.log(this.orbitingObjects);
    // const resizer = new Resizer(container, this.camera, this.renderer);
  }

  clearTrace() {
    CelestialObjects.forEach(body => {
      if (body.name.toUpperCase() !== 'SUN') {
        body.trace = [];  
      }
    });
  }

  // 天體軌跡記錄啟動
  set OrbitingRecordTrace (flag) {
    const st = (flag === true)? true : false;
    CelestialObjects.forEach(body => {
      console.log(body.name, body.isTraced, st);  // for debug only  // TO DO: INSERT CELESTIAL OBJECT DATA
      body.isTraced = st
      if(!st) {
        body.trace = []
      }
    })
  }
}

export { SpaceScene };

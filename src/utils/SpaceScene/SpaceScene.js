import { Vector3 } from "three";
import { EmptyScene } from "./EmptyScene.js";
import { createLightSource } from "./components/light.js";
import { createBackground, CelestialBody } from "./components/objects.js";
import { SUN_DATA, PLANETS_DATA } from "./utils/constants.js";
import { Resizer } from "./core/Resizer.js";


class SpaceScene extends EmptyScene {
  constructor(container) {
    super(container);

    console.log(this.CelestialObjects)

    // Stage props for the scene
    const backgroundSphere = createBackground();
    const sunLight = createLightSource('sun');
    const backgroundLight = createLightSource('ambient');
    
    [ sunLight, backgroundLight, backgroundSphere ].forEach(stageProp => {
      this.scene.add(stageProp);
    })

    // Celestial objects
    this.generateObjects([SUN_DATA]);
    this.generateObjects(PLANETS_DATA);

    const resizer = new Resizer(container, this.camera, this.renderer);
  }

  generateObjects(dataset) {
    return dataset.forEach((data) => {
      const body = new CelestialBody(this.scene, this.camera, data, this.labelRenderer);
      console.log('Created', body.name); 
      this.scene.add(body.container);
      if (data.name.toUpperCase() !== 'SUN') {
        this.loop.updatables.push(body.container);
      }
      this.CelestialObjects.push(body);
    });
  };

  clearTrace() {
    this.CelestialObjects.forEach(body => {
      body.trace = [];
    });
  }

  // Toggle visibility of celestial body labels
  toggleLabels() {
    this.CelestialObjects.forEach(body => {
      body.label.visible = !body.label.visible;
      this.labelRenderer.render(this.scene, this.camera);
    });
  }

  // 天體軌跡記錄啟動
  set OrbitingRecordTrace (flag) {
    const st = (flag === true)? true : false;
    this.CelestialObjects.forEach(body => {
      // console.log(body.name, body.isTraced, st);  // for debug only  // TO DO: INSERT CELESTIAL OBJECT DATA
      body.isTraced = st
      if(!st) {
        body.trace = []
      }
    })
  }
  
}

export { SpaceScene };

import Kepler1stLawPage from "@/components/topics/Kepler1stLawPage.vue";
import { EmptyTopic } from "./EmptyTopic";
import { J2000 } from "../utils/constants";
import { createOrbitingObject } from "../components/objects";

let custom_planet = {
  name: "custom planet",
  orbitalElements: {
    a: 1,
    e: 0.20563593,
    i: 7.00497902,
    om: 48.33076593,
    w: 77.45779628,
    ma: 174.796,
    epoch: J2000,
  },
  color: 0xd3d3d3, // LightGray
  radius: 0.383, // Radius
  mass: 0.055, // Mass relative to Earth
  category: "custom",
  isTrace: false,
};
export class Kepler1stLaw extends EmptyTopic {
  constructor() {
    super("Kepler's First Law", Kepler1stLawPage, true);
    this.params = {
      e: 0.20563593,
      a: 1.38709927,
      i: 7.00497902,
      om: 48.33076593,
      w: 77.45779628,
      ma: 174.796,
      epoch: J2000,
    };
    custom_planet.orbitalElements = this.params;
  }

  onEnter(scene, camera, loop) {
    super.onEnter(scene, camera, loop);
    // camera.position.set(0, 0, 100);

    const orbitingObject = createOrbitingObject(custom_planet);
    this.scene.add(orbitingObject);
    this.loop.updatables.push(orbitingObject);
    custom_planet.isTrace = true;
    orbitingObject.name = "HI";
  }
  //TODO:
  // 1. adjust min and max
  // 2. handle e > 1
  // 3. change color
  addPane(_pane) {
    const pane = _pane.addFolder({ title: "Orbit Elements" });
    const data = {
      a: {
        label: "Semi-major Axis (AU)",
        min: 0.2,
        step: 0.01,
        max: 40,
      },
      e: {
        label: "Eccentricity",
        min: 0,
        max: 1,
        step: 0.001,
      },
      i: {
        label: "Inclination (deg)",
        min: 0,
        max: 180,
        step: 1,
      },
      om: {
        label: "Longitude of Ascending Node (deg)",
        min: 0,
        max: 360,
        step: 1,
      },
      w: {
        label: "Argument of Periapsis (deg)",
        min: 0,
        max: 360,
        step: 1,
      },
      ma: {
        label: "Mean Anomaly at epoch (deg)",
        min: 0,
        max: 360,
        step: 1,
      },
    };
    Object.keys(data).forEach((key) => {
      pane.addBinding(this.params, key, data[key]).on("change", () => {
        this._clearTrace();
      });
    });
    //   pane.addBinding(this.params, label, {
    //     label: label,
    //     min: 0,
    //     max: 1,
    //     step: 0.001,
    //   });
    // });
    // pane
    //   .addBinding(this.params, "e", {
    //     label: "Eccentricity",
    //     min: 0,
    //     max: 1,
    //     step: 0.001,
    //   })
    //   .on("change", () => {
    //     this._clearTrace();
    //   });
    // pane
    //   .addBinding(this.params, "a", {
    //     label: "Semi-major Axis (AU)",
    //     min: 0.2,
    //     step: 0.01,
    //     max: 40,
    //   })
    //   .on("change", () => {
    //     this._clearTrace();
    //   });
    // pane.addBinding(this.params, "i", {
    //   label: "Inclination (deg)",
    //   min: 0,
    //   max: 180,
    //   step: 1,
    // });
  }

  _clearTrace() {
    custom_planet.trace = [];
  }
}

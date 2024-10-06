import Kepler1stLawPage from "@/components/topics/Kepler1stLawPage.vue";
import { EmptyTopic } from "./EmptyTopic";
import { J2000 } from "../utils/constants";
import { CelestialBody } from "../components/objects";
import { CelestialBody } from "../components/objects";

let custom_planet = {
  name: "custom planet",
  orbitalParameters: {
    a: 1,
    e: 0.20563593,
    i: 7.00497902,
    om: 48.33076593,
    w: 77.45779628,
    ma: 174.796,
    epoch: J2000,
  },
  color: 0x00ff00,
  radius: 0.383, // Radius
  mass: 0.055, // Mass relative to Earth
  category: "custom",
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
    custom_planet.orbitalParameters = this.params;
  }

  onEnter(scene, camera, loop) {
    super.onEnter(scene, camera, loop);
    // camera.position.set(0, 0, 100);

    this.orbitingObject = new CelestialBody(this.scene, custom_planet);
    this.scene.add(this.orbitingObject.container);
    this.loop.updatables.push(this.orbitingObject.container);
    this.orbitingObject.isTraced = true;
    this.orbitingObject.name = "HI";
  }

  onExit() {
    super.onExit();
    this.scene.remove(this.orbitingObject.container);
    this.loop.updatables = this.loop.updatables.filter(
      (updatable) => updatable !== this.orbitingObject.container
    );
  }
  //TODO:
  // 1. adjust min and max
  // 2. handle e > 1
  // 3. change color
  addPane(_pane) {
    const pane = _pane.addFolder({ title: "Orbital Elements" });
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
        label: "Longitude of \nAscending Node (deg)",
        min: 0,
        max: 360,
        step: 1,
      },
      w: {
        label: "Argument of \nPeriapsis (deg)",
        min: 0,
        max: 360,
        step: 1,
      },
      ma: {
        label: "Mean Anomaly \nat epoch (deg)",
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
  }

  _clearTrace() {
    this.orbitingObject.trace = [];
  }
}

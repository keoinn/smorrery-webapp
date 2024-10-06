import { DoubleSide, Mesh } from "three";
import { SPACE_SCALE, SSS_TEXTURES } from "../utils/constants";
import { CelestialBody } from "./objects";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Vector3 } from "three";

function createPlane({
  width = 1200,
  height = 1200,
  color = 0xffffff,
  opacity = 0.1,
  rotation = null,
  normalVector = null,
  transparent = true,
  visible = false,
} = {}) {
  if (!rotation && !normalVector) {
    throw new Error("Either rotation or normalVector must be provided");
  }

  const plane = new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({
      color: color,
      side: DoubleSide,
      transparent: transparent,
      opacity: opacity,
    })
  );

  // Apply either rotation or normalVector logic
  if (rotation) {
    plane.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
  } else {
    plane.lookAt(normalVector.clone().normalize());
  }

  plane.visible = visible;

  return plane;
}

export class CustomCelestialBody extends CelestialBody {
  constructor(scene, camera, data, labelRenderer, texturePack = SSS_TEXTURES) {
    super(scene, camera, data, labelRenderer, texturePack);
    if (data.category !== "custom") {
      throw new Error("CustomCelestialBody must have category 'custom'");
    }
    this.calcOrbitalElements();
    this.orbit = this.createOrbit(300, true);
    this.scene.add(this.orbit);
    this.orbit.visible = true;
    // this.orbitalPlane = this.createOrbitalPlane(this.orbitalParameters.h_vec, true);
    // this.orbitalVectors = this.createOrbitalVectors(true);
  }

  _updateOrbit() {
    this.scene.remove(this.orbit);
    this.orbit = this.createOrbit(300, true);
    this.scene.add(this.orbit);
    this.orbit.visible = true;
  }

  createOrbitalPlane(normalVector, visible = false) {
    const planeSize = this.orbitalParameters.Q * 2.5 * SPACE_SCALE;
    const plane = createPlane({
      normalVector: normalVector,
      width: planeSize,
      height: planeSize,
      color: this.color,
      opacity: 0.1,
      transparent: true,
      visible: visible,
    });

    this.scene.add(plane);
    return plane;
  }

  calcOrbitalElements() {
    // // Calculate Specific Mechanical Energy (ε)
    // const posMag = position.length();
    // const velMag = velocity.length();
    // const epsilon = velMag ** 2 / 2 - mu / posMag;

    // // Calculate Semi-major Axis (a)
    // const a = -mu / (2 * epsilon);

    // // Calculate Specific Angular Momentum Vector (h)
    // const h_vec = new THREE.Vector3().crossVectors(position, velocity);

    // // Calculate Eccentricity Vector (e_vec) and Eccentricity (e)
    // const vCrossHByMu = velocity.clone().cross(h_vec).divideScalar(mu);
    // const e_vec = vCrossHByMu
    //   .sub(position.clone().normalize())
    //   .multiplyScalar(-1);
    // const e = e_vec.length();

    // // Calculate Inclination (i)
    // const i = Math.acos(h_vec.y / h_vec.length()) * (180 / Math.PI);

    // // Calculate Longitude of Ascending Node (Ω)
    // let Omega = Math.atan2(h_vec.x, -h_vec.z) * (180 / Math.PI);
    // if (Omega < 0) Omega += 360;

    // // Calculate Argument of Perihelion (ω)
    // const n_vec = new THREE.Vector3(h_vec.z, 0, -h_vec.x); // Node vector
    // const omega =
    //   Math.acos(n_vec.dot(e_vec) / (n_vec.length() * e)) * (180 / Math.PI);
    // const varpi = omega + Omega;

    // // 計算角動量向量 h_vec
    // const p = this.a * (1 - this.e ** 2);
    // const h = Math.sqrt(mu * p);
    const mu = 39.421 //G * sunMass; // Standard gravitational parameter
    const p = this.orbitalParameters.a * (1 - this.orbitalParameters.e ** 2);
    const h = Math.sqrt(mu * p);
    this.orbitalParameters.h_vec = new Vector3(
      h *
        Math.sin((this.orbitalParameters.i * Math.PI) / 180) *
        Math.sin((this.orbitalParameters.om * Math.PI) / 180),
      h * Math.cos((this.orbitalParameters.i * Math.PI) / 180),
      h *
        Math.sin((this.orbitalParameters.i * Math.PI) / 180) *
        Math.cos((this.orbitalParameters.om * Math.PI) / 180)
    );
    this.orbitalParameters.Q = this.orbitalParameters.a * (1 + this.orbitalParameters.e)
    // if (verbose) {
    //   printQuantity(G, "G", "AU^3 yr^(-2) EarthMass^(-1)");
    //   printQuantity(sunMass, "M", "EarthMass");
    //   printQuantity(mu, "µ", "AU^3 yr^(-2)");
    //   // printQuantity(position, 'r', 'AU');
    //   printQuantity(posMag, "|r|", "AU");
    //   // printQuantity(velocity, 'v', 'AU/yr');
    //   printQuantity(velMag, "|v|", "AU/yr");
    //   printQuantity(epsilon, "ε", "EarthMass AU^2 yr^(-2)");
    //   printQuantity(a, "a", "AU");
    //   // printQuantity(h_vec, 'h');
    //   // printQuantity(e_vec, 'e');
    //   printQuantity(e, "|e|");
    //   printQuantity(i, "i", "°");
    //   printQuantity(Omega, "Ω", "°");
    //   printQuantity(omega, "ω", "°");
    //   printQuantity(h_vec.length(), "|h|", "AU^2/yr");
    //   console.log("h_vec:", h_vec);
    // }
    // console.log(this)
    // return {
    //   a: this.orbitalParameters.a,
    //   e: this.orbitalParameters.e,
    //   i: this.orbitalParameters.i,
    //   om: this.orbitalParameters.om,
    //   varpi: this.orbitalParameters.varpi,
    //   ma: 0, // to be calculated later
    //   q: this.orbitalParameters.a * (1 - this.orbitalParameters.e),
    //   Q: this.orbitalParameters.a * (1 + this.orbitalParameters.e),
    //   h_vec: h_vec,
    // //   e_vec: e_vec,
    // //   n_vec: n_vec,
    // };
  }
}

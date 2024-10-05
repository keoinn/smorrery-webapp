import { EmptyTopic } from "./EmptyTopic";
import Kepler2ndLawPage from "@/components/topics/Kepler2ndLawPage.vue";
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { calculateJulianDate } from "../utils/calculator";
import { J2000 } from "../utils/smorrery_const";
import { DoubleSide } from "three";

const PHASE_NUMBER = 8;

//TODO:
// 1. calculate swept area
// 2. maybe dynamic orbiting speed
export class Kepler2ndLaw extends EmptyTopic {
  constructor() {
    super("Kepler's Second Law", Kepler2ndLawPage, false);
    this.previousPoint = null;
    this.previousSweptAreaPhase = null;
    this.sweptAreaGroup = new Group();
    this.currentObject = null;
  }

  onEnter(scene, camera) {
    super.onEnter(scene, camera);
    this.sweptAreaGroup.clear();
    this.scene.add(this.sweptAreaGroup);
  }

  onExit() {
    //TODO: test onExit
    super.onExit();
    this.sweptAreaGroup.clear();
    this.scene.remove(this.sweptAreaGroup);
  }

  onObjectChange(newObject, oldObject) {
    this.currentObject = newObject.shift();
    this.currentObject.isTrace = true;
    this.sweptAreaGroup.clear();
    this.previousPoint = null;
    this.previousSweptAreaPhase = null;
  }

  tick(delta, scene, currentDate) {
    if (!this.currentObject) return;
    const currentJulianDate = calculateJulianDate(currentDate);
    const yearSinceJ2000 = (currentJulianDate - J2000) / 365.25;
    //TODO: change this.currentObject.T to this.currentObject.period
    let sweptAreaPhase =
      Math.floor((PHASE_NUMBER * yearSinceJ2000) / this.currentObject.T) %
      PHASE_NUMBER;
    if (
      this.previousSweptAreaPhase === PHASE_NUMBER - 1 &&
      sweptAreaPhase === 0
    ) {
      this.sweptAreaGroup.clear();
    }
    let position = null;
    if (this.currentObject.trace) position = this.currentObject.trace.at(-1);

    //TODO: change this to this.currentObject.container.position
    // Create swept area for the current phase
    if (position) {
      this._createSweptArea(position, sweptAreaPhase);
      this.previousSweptAreaPhase = sweptAreaPhase;
    }
  }

  _createSweptArea(point, sweptAreaPhase) {
    if (!this.previousPoint) {
      this.previousPoint = point.clone(); // Store the first point and wait for the next call
      return;
    }
    // Material for the swept area (same color logic: magenta for even, cyan for odd)
    const material = new MeshBasicMaterial({
      color: sweptAreaPhase % 2 === 0 ? 0xff00ff : 0x00ffff, // Even = magenta, Odd = cyan
      side: DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    // Define vertices for the triangle in 3D space: (0, 0, 0), previousPoint, and current point
    const vertices = new Float32Array([
      0,
      0,
      0, // Origin (Sun) at (0, 0, 0)
      this.previousPoint.x,
      this.previousPoint.y,
      this.previousPoint.z, // Previous point in 3D space
      point.x,
      point.y,
      point.z, // Current point in 3D space
    ]);
    // Create BufferGeometry and add the vertices
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    // Define the indices for the triangle (0, 1, 2 correspond to the vertex positions)
    const indices = [0, 1, 2];
    geometry.setIndex(indices);
    const sweptArea = new Mesh(geometry, material);
    this.sweptAreaGroup.add(sweptArea);
    // Add the group to the scene if it's not already there
    if (!this.scene.children.includes(this.sweptAreaGroup)) {
      this.scene.add(this.sweptAreaGroup);
    }
    // Update the previous point to the current point for the next call
    this.previousPoint = point.clone();
  }
}

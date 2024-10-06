import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SPACE_SCALE } from "../utils/constants";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = SPACE_SCALE * 0.1;
  controls.maxDistance = SPACE_SCALE * 40;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
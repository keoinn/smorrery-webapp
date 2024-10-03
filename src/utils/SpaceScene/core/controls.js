import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let spaceScale = 20

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = spaceScale * 0.1;
  controls.maxDistance = spaceScale * 40;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
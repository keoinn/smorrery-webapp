import { PerspectiveCamera } from "three";

function createCamera(width, height) {
  const camera = new PerspectiveCamera(75, width / height, 0.1, 2000);
  camera.position.set(0, 20, 50);
  return camera;
}

export { createCamera };

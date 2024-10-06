import { WebGLRenderer, PCFSoftShadowMap } from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

function createRenderer(width, height) {
  const renderer = new WebGLRenderer({ antialias: true });

  // Config for WebGLRenderer
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  return renderer;
}

function createLabelRenderer(width, height) {
  const labelRenderer = new CSS2DRenderer()

  // config for CSS2DRenderer
  labelRenderer.setSize(width, height)
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';

  return labelRenderer
}

export { createRenderer, createLabelRenderer };

import { createScene } from "./components/scene.js";
import { createRenderer, createLabelRenderer } from "./core/renderer.js";
import { createCamera } from "./components/camera.js";
import { Loop } from "./core/loop.js";
import { createControls } from "./core/controls.js";

let timeDirection = 1;
let timeScale = 1;
let container_width = window.innerWidth;
let container_height = window.innerHeight;

class EmptyScene {
  constructor(container) {
    container_width = window.innerWidth;
    container_height = window.innerHeight;

    // 初始建構
    this.scene = createScene();
    this.renderer = createRenderer(container_width, container_height);
    this.labelRender = createLabelRenderer(container_width, container_height);
    this.camera = createCamera(container_width, container_height);
    this.currentDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    this.loop = new Loop(
      this.camera,
      this.scene,
      this.renderer,
      timeScale,
      this.currentDate,
      timeDirection
    );

    // 添加畫布
    container.append(this.renderer.domElement);
    container.append(this.labelRender.domElement);

    // 畫面控制器
    const controls = createControls(this.camera, this.labelRender.domElement);
    this.loop.updatables.push(controls);
  }

  render() {
    // draw a single frame
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { EmptyScene };

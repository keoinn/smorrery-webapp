import { createScene } from "./components/scene.js";
import { createRenderer, createLabelRenderer } from "./core/renderer.js";
import { createCamera } from "./components/camera.js";
import { Loop } from "./core/loop.js";
import { createControls } from "./core/controls.js";

class EmptyScene {
  constructor(container) {
    this.container_width = container.clientWidth;
    this.container_height = container.clientHeight;

    // 初始建構
    this.timeDirection = 1; // 1: forward, -1: backward
    this.timeScale = 1; // 控制時間差倍率
    this.isPlayed = 1; // 是否計算下一幀差異
    
    this.scene = createScene();
    this.renderer = createRenderer(this.container_width, this.container_height);
    this.labelRenderer = createLabelRenderer(this.container_width, this.container_height);
    this.camera = createCamera(this.container_width, this.container_height);
    this.currentDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    this.loop = new Loop(
      this.camera,
      this.scene,
      this.renderer,
      this.labelRenderer,
      this.timeScale,
      this.currentDate,
      this.timeDirection,
    );

    // 添加畫布
    container.append(this.renderer.domElement);
    container.append(this.labelRenderer.domElement);

    // 畫面控制器
    const controls = createControls(this.camera, this.labelRenderer.domElement);
    this.loop.updatables.push(controls);
  }

  // Manual control of single-frame rendering of the scene; temporarily unused
  render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { EmptyScene };

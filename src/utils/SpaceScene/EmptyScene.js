import { Vector3 } from "three";
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

    // Array of celestial objects, for handling visiblity of visual components
    this.CelestialObjects = [];

    // 畫面控制器
    const controls = createControls(this.camera, this.labelRenderer.domElement);
    this.loop.updatables.push(controls);

    // Add event listener for keyboard input
    this.addKeyboardControls();
  }

  addKeyboardControls() {
    let cameraDirection = new Vector3();

    window.addEventListener('keydown', (event) => {
      switch (event.key.toUpperCase()) {
        case 'ARROWUP':  // Move camera closer to center
          this.camera.getWorldDirection(cameraDirection);
          this.camera.position.addScaledVector(cameraDirection, 2);
          break;
        case 'ARROWDOWN':  // Move camera away from center
          this.camera.getWorldDirection(cameraDirection);
          this.camera.position.addScaledVector(cameraDirection, -2);
          break;
        case 'ARROWLEFT':  // Move camera counter-clockwise
          this.camera.rotateY(5 * Math.PI / 180); 
          break;
        case 'ARROWRIGHT':  // Move camera clockwise
          this.camera.rotateY(-5 * Math.PI / 180);
          break;
        case 'L':
          console.log('Toggle labels');
          this.toggleLabels();
          break;
        case ' ':  // Toggle Play/Pause
          this.isPlayed = !this.isPlayed;
          if (this.isPlayed) {
            this.start();  // Resume animation
          } else {
            this.stop();  // Pause animation
          }
          break;
        case 'R':  // Toggle Forward/Backward 
          this.loop.timeDirection = -this.loop.timeDirection;
          this.start();  // Start animation
          break;
      }
    });
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

  // Toggle visibility of celestial body labels
  toggleLabels() {
    this.CelestialObjects.forEach(body => {
      body.label.visible = !body.label.visible;
      this.labelRenderer.render(this.scene, this.camera);
    });
  }
}

export { EmptyScene };

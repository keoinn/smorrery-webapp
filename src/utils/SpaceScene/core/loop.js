// import { Clock } from "three";
// import { MAX_DATE, MAX_DATE } from "@/utils/SpaceScene/utils/smorrery_const.js";
import { calculateJulianDateSinceJ2000 } from "@/utils/SpaceScene/utils/calculator.js";
// const clock = new Clock();
const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);


class Loop {
  constructor(camera, scene, renderer, timeScale, currentDate, timeDirection) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.timeScale = timeScale
    this.currentDate = currentDate;
    this.timeDirection = timeDirection;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    // const delta = clock.getDelta();

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );
    
    const oneFrameInMilliseconds = this.timeScale * 24 * 60 * 60 * 1000;
    if (this.timeDirection > 0) {
      this.currentDate.setTime(this.currentDate.getTime() + oneFrameInMilliseconds);
    } else {
      this.currentDate.setTime(this.currentDate.getTime() - oneFrameInMilliseconds);
    }

    if (this.currentDate < MIN_DATE) {
      this.currentDate = MIN_DATE;
    } else if (this.currentDate > MAX_DATE) {
      this.currentDate = MAX_DATE;
    }

    const delta = calculateJulianDateSinceJ2000(this.currentDate)

    for (const object of this.updatables) {
      object.tick(delta, this.scene);
    }
  }
}

export { Loop };

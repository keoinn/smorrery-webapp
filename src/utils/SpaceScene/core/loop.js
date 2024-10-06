import { Clock } from "three";
import { ref } from 'vue';
import { RENDER_TIMES } from "@/utils/SpaceScene/utils/constants.js";
import { calcYearSinceJ2000 } from "@/utils/SpaceScene/utils/calculator.js";
// const clock = new Clock();
const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);

let fps_timer = 0
const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer, timeScale, currentDate, timeDirection, isPlayed) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.timeScale = timeScale
    this.currentDate = currentDate;
    this.timeDirection = timeDirection;
    this.isPlayed = isPlayed

    // Reactivity API for watch from Outer
    this.currentDate_ref = ref('')
    this.currentDate_ref.value = currentDate.getTime();
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // Frames 控制
      let delta_times = clock.getDelta();
      fps_timer = fps_timer + delta_times
      
      // render a frame
      if(fps_timer > RENDER_TIMES) {
        this.renderer.render(this.scene, this.camera);
        fps_timer = 0
      }
    });
  }

  // 改變日期
  set shiftDate(val) {
    this.currentDate = new Date(val)
    this.currentDate_ref.value = this.currentDate.getTime();
    const delta = calcYearSinceJ2000(this.currentDate)
    for (const updatable of this.updatables) {
      updatable.tick(delta, this.scene);
      updatable.trace = []
    }

  }

 
  set played(display_st) {
    if(display_st === 1) {
      this.isPlayed = 1
    }else{
      this.isPlayed = 0
    }
  }

  set timeDirect(direct) {
    if(direct === 1) {
      this.timeDirection = 1
    }else{
      this.timeDirection = 0
    }
  }

  set timeScaleRate(rate) {
    this.timeScale = rate
  }

  stop() {
    fps_timer = 0
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    if (this.isPlayed) {
      const oneFrameInMilliseconds = this.timeScale * 24 * 60 * 60 * 1000;
      if (this.timeDirection === 1) {
        this.currentDate.setTime(this.currentDate.getTime() + oneFrameInMilliseconds);
      } else {
        this.currentDate.setTime(this.currentDate.getTime() - oneFrameInMilliseconds);
      }
  
      if (this.currentDate < MIN_DATE) {
        this.currentDate = MIN_DATE;
      } else if (this.currentDate > MAX_DATE) {
        this.currentDate = MAX_DATE;
      }  
      const delta = calcYearSinceJ2000(this.currentDate)

      // Reactivity API for watch from outside
      this.currentDate_ref.value = this.currentDate.getTime()

      for (const updatable of this.updatables) {
        updatable.tick(delta, this.scene);
      }
    }
  }
}

export { Loop };

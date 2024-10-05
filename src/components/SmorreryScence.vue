<script setup>
import { ref, onMounted, watch, computed, reactive} from "vue";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";

let space_scene;
const target = ref();

// 畫布啟動
const scene_st = ref(false);
// 播放
const control_st = ref(false);
// 前進與倒退
const forward_st = ref(true);

// 軌跡
const isTrace = ref(false);

// Speed
const timeSpeed = ref(1.0);

//currentDate
const currentDate = ref(946728000000)



// 畫布啟動關閉 -> 畫面渲染
const controlStatusScene = () => {
  scene_st.value = !scene_st.value;
  if (scene_st.value) {
    space_scene.start();
  } else {
    space_scene.stop();
  }
};

// Control Bar Action
const palyingStatuChange = () => {
  control_st.value = !control_st.value;
  if (control_st.value) {
    space_scene.loop.played = 1;
  } else {
    space_scene.loop.played = 0;
  }
};

const forwardControlChange = () => {
  forward_st.value = !forward_st.value;
  if (forward_st.value) {
    space_scene.loop.timeDirect = 1;
  } else {
    space_scene.loop.timeDirect = 0;
  }
  space_scene.clearTrace();
};

const changeIsTraceStatus = () => {
  isTrace.value = !isTrace.value;
  space_scene.OrbitingRecordTrace = isTrace.value;
  console.log(space_scene.orbitingObjects);
};

const dateShift = (val) => {
  space_scene.loop.shiftDate = val
  isTrace.value = false
  space_scene.OrbitingRecordTrace = isTrace.value;
  space_scene.clearTrace();
  
}

watch(timeSpeed, (val) => {
  console.log(val);
  space_scene.loop.timeScaleRate = val;
});


// 顯示小數點
const showFixedSpeedVal = (val) => {
  const val_int = parseFloat(val);
  return val_int;
};

// 計算日期字串
const showDateString = (val) => {
  const d = new Date(val)
  return d.getFullYear() + 
          "-" + ("0"+(d.getMonth()+1)).slice(-2) + 
          "-" + ("0" + d.getDate()).slice(-2)
}

const showJDText = (val) => {
  return ((val / 86400000) + 2440587.5).toFixed(2);
}

onMounted(() => {
  const target_s = document.querySelector("#target");
  space_scene = new SpaceScene(target_s);

  watch(space_scene.loop.currentDate_ref, (val) => {
    currentDate.value = val
  });

});
</script>

<template>
  <div id="target" ref="target">
    <div id="info">
      Interactive 3D Orrery<br />Drag to rotate, scroll to zoom
    </div>
    <div id="timeControl">
      <v-btn
        class="video-btn text-none"
        @click="controlStatusScene"
        :text="scene_st === true ? `Stop` : `Run`"
        size="small"
      />
      <v-btn
        class="video-btn"
        :disabled="!scene_st"
        :icon="control_st === true ? `mdi-pause` : `mdi-play`"
        @click="palyingStatuChange"
        size="small"
      />
      <v-btn
        class="video-btn"
        :disabled="!scene_st"
        :icon="forward_st === true ? `mdi-skip-backward` : `mdi-skip-forward`"
        @click="forwardControlChange"
        size="small"
      />

      <v-btn
        class="video-btn text-none"
        :disabled="!scene_st || !control_st"
        :prepend-icon="isTrace === true ? `mdi-stop-circle` : `mdi-record`"
        @click="changeIsTraceStatus"
        text="Trace"
        size="small"
      />

      <v-btn
        class="video-btn text-none"
        :disabled="!scene_st"
        text="J2000"
        size="small"
        @click="dateShift(946728000000)"
      />

      <v-btn
        class="video-btn text-none"
        :disabled="!scene_st"
        text="Today"
        size="small"
        @click = "dateShift(new Date().getTime())"
      />

      <div class="speedControl">
        <label for="speedSlider">Speed:</label>
        <input
          v-model="timeSpeed"
          type="range"
          id="speedSlider"
          min="0.1"
          max="10"
          step="0.01"
          :disabled="!scene_st"
        />
        <span id="speedValue">{{ showFixedSpeedVal(timeSpeed) }}x</span>
      </div>

      <span class="info-text">{{ showDateString(currentDate) }}</span>
      <span class="info-text"> JD {{ showJDText(currentDate) }}</span>
    </div>
  </div>
</template>

<style lang="scss">
#target {
  height: calc(100vh - 50px);
  #info {
    position: absolute;
    top: 10%;
    width: 100%;
    text-align: center;
    color: white;
    background-color: transparent;
    z-index: 1;
    font-family: monospace;
  }
  #timeControl {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    color: white;
    font-family: Arial, sans-serif;
    z-index: 1000;

    .video-btn {
      margin-left: 10px;
    }

    .speedControl {
      display: flex;
      align-items: center;
      label {
        padding-left: 10px;
      }

      input {
        width: 100px;
      }
    }

    .info-text {
      min-width: 150px;
      text-align: center;
    }
  }
}
</style>

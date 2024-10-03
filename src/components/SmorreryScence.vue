<script setup>
import { ref, onMounted, watch } from "vue";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";
import { fa } from "vuetify/locale";

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
  space_scene.clearTrace()
};

const changeIsTraceStatus = () => {
  isTrace.value = !isTrace.value
  space_scene.OrbitingRecordTrace = isTrace.value
  console.log(space_scene.orbitingObjects)
}




onMounted(() => {
  const target_s = document.querySelector("#target");
  space_scene = new SpaceScene(target_s);
});
</script>

<template>
  <div id="target" ref="target">
    <div id="info">
      Interactive 3D Orrery<br />Drag to rotate, scroll to zoom
    </div>
    <div id="timeControl">
      <v-btn
        class="video-btn"
        @click="controlStatusScene"
        :text="scene_st === true ? `Stop` : `Run`"
      />
      <v-btn
        class="video-btn"
        :disabled="!scene_st"
        :icon="control_st === true ? `mdi-pause` : `mdi-play`"
        @click="palyingStatuChange"
      />
      <v-btn
        class="video-btn"
        :disabled="!scene_st"
        :icon="forward_st === true ? `mdi-skip-backward` : `mdi-skip-forward`"
        @click="forwardControlChange"
      />

      <v-btn
        class="video-btn"
        :disabled="!scene_st || !control_st"
        @click="changeIsTraceStatus"
        :text="isTrace === true ? ` Clear Trace` : `Record Trace`"
      />
      

    </div>
  </div>
</template>

<style lang="scss">
#target {
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
    left: 50%;
    bottom: 13%;
    transform: translateX(-50%);
    background: rgba(205, 140, 140, 0.7);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    color: white;
    font-family: monospace;
    z-index: 1;

    .video-btn {
      margin-left: 10px;
    }
  }
}
</style>

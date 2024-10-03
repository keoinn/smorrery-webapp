<script setup>
import { ref, onMounted, watch } from "vue";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";
const target = ref();

const control_btn_icon = ref('mdi-pause')
const control_st = ref(false)

const forward_btn_icon = ref('mdi-skip-backward') //mdi mdi-fast-backward
const forward_st = ref(true)


let space_scene


// Control Bar Action
const palyingStatuChange = () => {
  control_st.value = !control_st.value
  control_btn_icon.value = (control_st.value)? "mdi-pause": "mdi-play"

  if(control_st.value){
    space_scene.start()
  }else{
    space_scene.stop()
  }
}

const forwardControlChange = () => {
  forward_st.value =!forward_st.value
  forward_btn_icon.value = (forward_st.value)? 'mdi-skip-backward' : 'mdi-skip-forward'
  
  if(forward_st.value) {
    space_scene.setTimeDirect(1)
  }else{
    space_scene.setTimeDirect(0)
  }
  space_scene.stop()
  space_scene.start()
}

onMounted(() => {
  const target_s = document.querySelector("#target");
  space_scene = new SpaceScene(target_s);
  if(control_st.value) {
    space_scene.start();
  }
});
</script>

<template>
  <div id="target" ref="target">
    <div id="info">
      Interactive 3D Orrery<br />Drag to rotate, scroll to zoom
    </div>
      <div id="timeControl">
        <v-btn class="video-btn" :icon="control_btn_icon" @click="palyingStatuChange" />
        <v-btn class="video-btn" :icon="forward_btn_icon" @click="forwardControlChange" />
    </div>
  </div>
  
</template>

<style lang="scss">
#target {
  #info {
    position: absolute;
    top: 5%;
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
    bottom: 10%;
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

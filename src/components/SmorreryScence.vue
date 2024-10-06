<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, reactive} from "vue";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";
import { fetchCadApi, fetchSbdbApi } from '@/utils/APIRequests/apis/event.js';
import { parseSmallBodiesData } from "@/utils/APIRequests/preprocessor.js";
import backgroundmusic from '@/assets/backgroundmusic.wav'

const NEO_AMOUNT = 10;
const CAD_MIN_DATE = '2024-01-01';
const CAD_MAX_DATE = '2025-01-01';
const CAD_MAX_DIST = '0.05';  

let space_scene;
const target = ref();

const scene_st = ref(false);  // Space Scene active or not
const control_st = ref(false);  // Control Bar active or not
const forward_st = ref(true);  // Animation forward or backward
const timeSpeed = ref(1.0);  // Animation speed
const isTraced = ref(false);  // Orbit tracing enable or not

//currentDate
const currentDate = ref(946728000000)

// Data Fetch
let neoData;  // from SBDB API response
let cadData;  // from CAD API response

// 背景音樂播放
const backgroundMusic = ref(false);
const isMuted = ref(true);


// 畫布啟動關閉 -> 畫面渲染
const controlStatusScene = () => {
  scene_st.value = !scene_st.value;

  if (scene_st.value) {
    space_scene.start();
    backgroundMusic.value.play();
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

const changeisTracedStatus = () => {
  isTraced.value = !isTraced.value;
  space_scene.OrbitingRecordTrace = isTraced.value;
  console.log(`Trace status = ${isTraced.value}`); // <--- TEST
};

const dateShift = (val) => {
  space_scene.loop.shiftDate = val
  isTraced.value = false
  space_scene.OrbitingRecordTrace = isTraced.value;
  space_scene.clearTrace();
  
}

watch(timeSpeed, (val) => {
  // console.log(`Speed = ${val}x`); // TEST: log the new speed value
  space_scene.loop.timeScaleRate = val;
});


const showFixedSpeedVal = (val) => {
  return parseFloat(val);
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

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  backgroundMusic.value.muted = isMuted.value;
};

onMounted(async () => {
  try {
    // Setup scene
    const target_s = document.querySelector("#target");  // Find the target element
    space_scene = new SpaceScene(target_s);
    
    // Start rendering the scene
    space_scene.start();

    // Fetch NEO data from SBDB API
    try {
      const sbdbResponse = await fetchSbdbApi(NEO_AMOUNT); // Get 200
      console.log('Fetched data:', sbdbResponse.data.data.length, 'NEOs.');
      neoData = sbdbResponse.data;

      let smallBodiesData = parseSmallBodiesData(neoData);
      console.log(smallBodiesData);
      space_scene.generateObjects(smallBodiesData);
    } catch (error) {
      console.error('Error fetching NEO data:', error);
    }

    // Fetch Close-Aproach event data from CAD API
    try {
      const cadResponse = await fetchCadApi(CAD_MIN_DATE, CAD_MAX_DATE, CAD_MAX_DIST);
      console.log('Fetched data:', cadResponse.data.data.length, 'close-approach events.');
      cadData = cadResponse.data;
    } catch (error) {
      console.error('Error fetching CAD data:', error);
    }

    // Watch for current date changes
    watch(space_scene.loop.currentDate_ref, (val) => {
      currentDate.value = val;
    });

    // Background music mute state
    backgroundMusic.value.muted = isMuted.value;

    // Add keyboard event listener for controlling labels and camera movement
    window.addEventListener('keydown', space_scene.addKeyboardControls());

  } catch (error) {
    console.error('Error setting up scene or rendering:', error);
  }
});

// Cleanup when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('keydown', space_scene.addKeyboardControls());  // Cleanup keyboard listener
  space_scene.stop();  // Stop the scene rendering
});


</script>

<template>
  <div id="target" ref="target">
    <div id="info">
      <!-- Interactive 3D Orrery<br />Drag to rotate, scroll to zoom -->
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
        :prepend-icon="isTraced === true ? `mdi-stop-circle` : `mdi-record`"
        @click="changeisTracedStatus"
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

      <v-btn
        class="video-btn"
        :icon="isMuted ? `mdi-volume-off` : `mdi-volume-high`"
        @click="toggleMute"
        size="small"
      />
      <audio ref="backgroundMusic" :src="backgroundmusic" autoplay loop style="display:none;"></audio>
    </div>
  </div>
</template>

<style lang="scss">
#target {
  // remove 50px from AppHeaderLogo
  height: calc(100vh - 50px);
  #info {
    position: absolute;
    top: 13%;
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

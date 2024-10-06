<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, reactive} from "vue";
import { Vector3 } from "three";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";
import { fetchCadApi, fetchSbdbApi } from '@/utils/APIRequests/apis/event.js';
import { parseSmallBodiesData } from "@/utils/APIRequests/preprocessor.js";
import { J2000, J1970 } from "@/utils/SpaceScene/utils/constants.js";
import backgroundmusic from '@/assets/backgroundmusic.wav'
import KeyboardShortcuts from '@/pages/keyboard_shortcuts.vue';

const NEO_AMOUNT = 10;
const CAD_MIN_DATE = '2024-01-01';
const CAD_MAX_DATE = '2025-01-01';
const CAD_MAX_DIST = '0.05';  

let space_scene;
const target = ref();
const timeSpeed = ref(1.0);  // Animation speed
const isRunning = ref(false);  // Space Scene active or not
const isPlaying = ref(false);  // Control Bar active or not
const isForward = ref(true);  // Animation forward or backward
const isTraced = ref(false);  // Orbit tracing enable or not
const isLabled = ref(false);  // Lable visible or not
const showShortcuts = ref(false);

//currentDate
const currentDate = ref(946728000000)

// Data Fetch
let neoData;  // from SBDB API response
let cadData;  // from CAD API response

// 背景音樂播放
const backgroundMusic = ref(false);
const isMuted = ref(true);

// 畫布啟動關閉 -> 畫面渲染
const toggleSceneStatus = () => {
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    space_scene.start();
    backgroundMusic.value.play();
  } else {
    space_scene.stop();
  } 
};

const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    space_scene.loop.played = 1;
  } else {
    space_scene.loop.played = 0;
  }
};

const toggleForwardBackard = () => {
  isForward.value = !isForward.value;
  if (isForward.value) {
    space_scene.loop.timeDirect = 1;
  } else {
    space_scene.loop.timeDirect = 0;
  }
  space_scene.clearTrace();
};

const toggleTraces = () => {
  isTraced.value = !isTraced.value;
  space_scene.OrbitingRecordTrace = isTraced.value;
  console.log(`Trace status = ${isTraced.value}`); // <--- TEST
};

// Toggle visibility of labels
function toggleLabels() {
  isLabled.value = !isLabled.value;
  space_scene.toggleLabels(isLabled.value);
}

const shiftDateAndClearTraces = (val) => {
  space_scene.loop.shiftDate = val
  space_scene.OrbitingRecordTrace = isTraced.value;
  space_scene.clearTrace();
}

watch(timeSpeed, (val) => {
  // console.log(`Speed = ${val}x`); 
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
  return ((val / 86400000) + J1970).toFixed(2);
}

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  backgroundMusic.value.muted = isMuted.value;
};

// Change playback speed with keyboard
function changePlaybackSpeed(deltaV) {
  const newSpeed = Math.max(0.1, Math.min(timeSpeed.value + deltaV, 10)); // Limit between 0.1x and 10x speed
  timeSpeed.value = Math.round(newSpeed * 100) / 100; // Round to 2 decimal place
  space_scene.loop.timeScale = timeSpeed.value;  // Update scene's playback speed
  console.log(`Playback speed: ${timeSpeed.value}x`);  // For debugging
}

// Jump to today's date
function jumpToToday() {
  const today = new Date();  // Get the current date
  shiftDateAndClearTraces(today);
  console.log(`Jumped to today's date: ${today}`);
}

// Jump to J2000 (January 1, 2000)
function jumpToJ2000() {
  const J2000_DATE = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));  // J2000 date
  shiftDateAndClearTraces(J2000_DATE);
  console.log(`Jumped to J2000 date: ${j2000}`);
}

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
    window.addEventListener('keydown', handleKeydown);

  } catch (error) {
    console.error('Error setting up scene or rendering:', error);
  }
});

// Cleanup when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);  // Cleanup keyboard listener
  space_scene.stop();  // Stop the scene rendering
});

// Handle keyboard input
function handleKeydown(event) {
  switch (event.key.toUpperCase()) {
    case 'W':  // Move camera closer to center
      space_scene.camera.getWorldDirection(new Vector3());
      space_scene.camera.position.addScaledVector(space_scene.camera.getWorldDirection(), 2);
      break;
    case 'S':  // Move camera away from center
      space_scene.camera.getWorldDirection(new Vector3());
      space_scene.camera.position.addScaledVector(space_scene.camera.getWorldDirection(), -2);
      break;
    case 'A':  // Rotate camera counter-clockwise
      space_scene.camera.rotateY(2 * Math.PI / 180);  // Rotate 15 degrees
      break;
    case 'D':  // Rotate camera clockwise
      space_scene.camera.rotateY(-2 * Math.PI / 180);  // Rotate -15 degrees
      break;
    case 'L':  // Toggle labels
      toggleLabels();
      break;
    case 'P':  // Toggle play/pause with spacebar
      togglePlayPause();
      break;
    case 'M':
      toggleMute();
      break;
    case 'T':
      toggleTraces();
      break;
    case 'ENTER':
      toggleSceneStatus();
      break;
    case 'J':  // Decrease playback speed
      changePlaybackSpeed(-0.1);
      break;
    case 'K':  // Increase playback speed
      changePlaybackSpeed(0.1);
      break;
    case 'R':  // Toggle Forward/Backard
      toggleForwardBackard();
      break;
    case 'H': 
      jumpToToday();
      break;
    case 'G': 
      jumpToJ2000();
      break;
    case 'M': 
      toggleMute();
      break;
    case 'I': 
      toggleShortcuts();
      break;
  }
}

const toggleShortcuts = () => {
  showShortcuts.value = !showShortcuts.value;
}

</script>

<template>
  <div id="target" ref="target">
    <div id="info">
      <!-- Interactive 3D Orrery<br />Drag to rotate, scroll to zoom -->
    </div>
    <div id="timeControl">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn text-none"
            v-bind="attrs" v-on="on"
            @click="toggleSceneStatus"
            :text="isRunning === true ? `Stop` : `Run`"
            size="small"
          />
        </template>
        <span>Start/Stop the scene (Shortcut: S)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning"
            :icon="isPlaying === true ? `mdi-pause` : `mdi-play`"
            @click="togglePlayPause"
            size="small"
          />
        </template>
        <span>Play/Pause (Shortcut: P)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning"
            :icon="isForward === true ? `mdi-skip-backward` : `mdi-skip-forward`"
            @click="toggleForwardBackard"
            size="small"
          />
        </template>
        <span>Forward/Backward (Shortcut: F)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn text-none"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning || !isPlaying"
            :prepend-icon="isTraced === true ? `mdi-checkbox-marked` : `mdi-checkbox-blank-outline`"
            @click="toggleTraces"
            text="Trace"
            size="small"
          />
        </template>
        <span>Toggle trace (Shortcut: T)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn text-none"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning || !isPlaying"
            :prepend-icon="isLabled === true ? `mdi-checkbox-marked` : `mdi-checkbox-blank-outline`"
            @click="toggleLabels"
            text="Label"
            size="small"
          />
        </template>
        <span>Toggle labels (Shortcut: L)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn text-none"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning"
            text="J2000"
            size="small"
            @click="jumpToJ2000"
          />
        </template>
        <span>Jump to J2000 (Shortcut: G)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn text-none"
            v-bind="attrs" v-on="on"
            :disabled="!isRunning"
            text="Today"
            size="small"
            @click="jumpToToday"
          />
        </template>
        <span>Jump to Today (Shortcut: H)</span>
      </v-tooltip>

      <div class="speedControl">
        <label for="speedSlider">Speed:</label>
        <input
          v-model="timeSpeed"
          type="range"
          id="speedSlider"
          min="0.1"
          max="10"
          step="0.01"
          :disabled="!isRunning"
        />
        <span id="speedValue">{{ showFixedSpeedVal(timeSpeed) }}x</span>
      </div>

      <span class="info-text">{{ showDateString(currentDate) }}</span>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn"
            v-bind="attrs" v-on="on"
            :icon="isMuted ? `mdi-volume-off` : `mdi-volume-high`"
            @click="toggleMute"
            size="small"
          />
        </template>
        <span>Toggle mute (Shortcut: M)</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="video-btn"
            v-bind="attrs" v-on="on"
            :icon="`mdi-information`"
            size="small"
            @click="toggleShortcuts"
          />
        </template>
        <span>Show keyboard shortcuts (Shortcut: ?)</span>
      </v-tooltip>


      <audio ref="backgroundMusic" :src="backgroundmusic" autoplay loop style="display:none;"></audio>
    </div>

    <KeyboardShortcuts v-if="showShortcuts" />

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

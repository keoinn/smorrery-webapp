<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { EducationScene } from "@/utils/SpaceScene/EducationScene.js";
import { EmptyTopic } from "@/utils/SpaceScene/topics/EmptyTopic.js";
import { TopicController } from "@/utils/SpaceScene/topics/TopicController.js";
import { Kepler2ndLaw } from "@/utils/SpaceScene/topics/Kepler2ndLaw";
import { Kepler3rdLaw } from "@/utils/SpaceScene/topics/Kepler3rdLaw";
import { Kepler1stLaw } from "@/utils/SpaceScene/topics/Kepler1stLaw";
import { VTweakpane } from "v-tweakpane";

const target = ref();
const celestialBodies = ref({});
let education_scene;
const isMultiSelect = ref(true);
const topics = ref([
  new Kepler2ndLaw(),
  new Kepler3rdLaw(),
  new Kepler1stLaw(),
]);

const topicController = ref(new TopicController(topics.value));
const tweakpaneState = ref({
  selectedBodies: ["Mercury"],
});

const onPaneCreated = (_pane) => {
  nextTick(() => {
    const container = document.querySelector(".tweakpane-container");
    if (container && _pane.element.parentElement) {
      container.appendChild(_pane.element);
    }
    const pane = _pane.addFolder({ title: "Select Objects" });
    if (isMultiSelect.value) {
      Object.keys(celestialBodies.value).forEach((category, index) => {
        const tab = pane.addFolder({
          title: category,
        });
        const params = {};
        celestialBodies.value[category].forEach((name) => {
          params[name] = name === "Mercury";
          tab.addBinding(params, name).on("change", (ev) => {
            if (
              ev.value &&
              !tweakpaneState.value.selectedBodies.includes(name)
            ) {
              tweakpaneState.value.selectedBodies.push(name);
            } else if (!ev.value) {
              tweakpaneState.value.selectedBodies =
                tweakpaneState.value.selectedBodies.filter((b) => b !== name);
            }
          });
        });
      });
    } else {
      const params = { selection: "Mercury" };
      const options = {};
      Object.keys(celestialBodies.value).forEach((category) => {
        celestialBodies.value[category].forEach((name) => {
          options[name] = name;
        });
      });
      pane
        .addBinding(params, "selection", { options: options })
        .on("change", (ev) => {
          tweakpaneState.value.selectedBodies = [ev.value];
        });
    }
    //TODO: change default selection
    handlePaneChaned({ selectedBodies: ["Mercury"] });
    if (currentTopic.value.addPane) {
      currentTopic.value.addPane(_pane);
    }
  });
};

const currentTopic = computed(() => {
  const topic = topicController.value.getCurrentTopic();
  if (topic) {
    return topic;
  } else {
    return new EmptyTopic("", null);
  }
});

const currentTopicPros = computed(() => {
  const topic = topicController.value.getCurrentTopic();
  if (topic && topic.pros) {
    return topic.pros.value;
  } else {
    return null;
  }
});
let oldValue = [];
function handlePaneChaned(changed) {
  const newValue = changed.selectedBodies;
  const oldBodies = Array.isArray(oldValue)
    ? oldValue
    : [oldValue].filter(Boolean);
  const newBodies = Array.isArray(newValue)
    ? newValue
    : [newValue].filter(Boolean);

  const removedBodies = oldBodies.filter((body) => !newBodies.includes(body));
  const addedBodies = newBodies.filter((body) => !oldBodies.includes(body));
  removedBodies.forEach((body) => education_scene.removeCelestialBody(body));
  addedBodies.forEach((body) => education_scene.addCelestialBody(body));

  const allObjects = education_scene.orbitingObjects;
  const addedObjects = allObjects.filter((obj) =>
    addedBodies.includes(obj.name)
  );
  const removedObjects = allObjects.filter((obj) =>
    removedBodies.includes(obj.name)
  );
  oldValue = Array.from(newValue);
  topicController.value
    .getCurrentTopic()
    .onObjectChange(addedObjects, removedObjects);
}

topicController.value.onTopicChange = (newTopic) => {
  isMultiSelect.value = newTopic.multiSelect;
  education_scene.removeAllCelestialBodies();
  education_scene.addCelestialBody(education_scene.orbitingObjects[0]);
};

//TODO:
// 2. add topics to navbar
// 3. adjust css to avoid overlapping
// 5. user can adjust width of the article
// 6. add time control at bottom
// 7. select topic from defined property
// 8. add button to toggle article
onMounted(() => {
  education_scene = new EducationScene(target.value);

  education_scene.addCustomTickFunction((delta, scene, currentDate) => {
    const topic = topicController.value.getCurrentTopic();
    if (topic) {
      topic.tick(delta, scene, currentDate);
    }
  });

  education_scene.start();
  topicController.value.setTopic(topics.value[0], education_scene);
  celestialBodies.value = education_scene.availableObjects;
  watch(tweakpaneState.value, handlePaneChaned);
});
</script>

<template>
  <div class="education-container">
    <div class="topic-panel" v-if="currentTopic">
      <h2>{{ currentTopic.title }}</h2>
      <component
        :is="currentTopic.content"
        v-if="currentTopic.content"
        :pros="currentTopicPros"
      ></component>
    </div>
    <div class="scene-panel">
      <div id="target" ref="target"></div>
      <div class="tweakpane-container">
        <v-tweakpane
          class="p-4"
          :pane="{ title: 'Controller' }"
          @on-pane-created="onPaneCreated"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.education-container {
  display: flex;
  height: 100vh;
}

.topic-panel {
  width: 30%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  padding-top: 120px;
}

.scene-panel {
  width: 70%;
  position: relative;
}

#target {
  width: 100%;
  height: 100%;
}

.tweakpane-container {
  position: absolute;
  top: 80px;
  right: 10px;
  z-index: 10;
}

/* 自定義 Tweakpane 樣式 */
:deep(.tp-dfwv) {
  min-width: 250px !important;
}

:deep(.tp-rotv) {
  min-width: 250px !important;
}
</style>
<style>
@import "v-tweakpane/dist/v-tweakpane.css";
</style>

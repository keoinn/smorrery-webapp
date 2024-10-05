<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { EducationScene } from "@/utils/SpaceScene/EducationScene.js";
import { EmptyTopic } from "@/utils/SpaceScene/topics/EmptyTopic.js";
import { TopicController } from "@/utils/SpaceScene/topics/TopicController.js";
import { Kepler2ndLaw } from "@/utils/SpaceScene/topics/Kepler2ndLaw";
import { Kepler3rdLaw } from "@/utils/SpaceScene/topics/Kepler3rdLaw";

const target = ref();
const selectedCelestialBodies = ref([]);
const celestialBodies = ref([]);
let education_scene;
const isMultiSelect = ref(true);
const topics = ref([new Kepler2ndLaw(), new Kepler3rdLaw()]);

const topicController = ref(new TopicController(topics.value));

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
  if (topic) {
    return topic.pros.value;
  } else {
    return null;
  }
});

function handleSelectedObjectChanged(newValue, oldValue) {
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
// 1. add body when first enter / change topic
// 2. add topics to navbar
// 3. adjust css to avoid overlapping
// 4. remove toggle isMultiSelect button
// 5. user can adjust width of the article
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

  celestialBodies.value = education_scene.getAvailableObjects();
  selectedCelestialBodies.value = isMultiSelect.value
    ? [celestialBodies.value[0]]
    : celestialBodies.value[0];

  watch(selectedCelestialBodies, handleSelectedObjectChanged);
});

function toggleMultiSelect() {
  isMultiSelect.value = !isMultiSelect.value;
  if (isMultiSelect.value) {
    selectedCelestialBodies.value = ["Mercury"];
  } else {
    selectedCelestialBodies.value = "Mercury";
  }
}
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
      <div class="controls">
        <button @click="toggleMultiSelect" class="toggle-button">
          {{ isMultiSelect ? "切換到單選" : "切換到多選" }}
        </button>
        <select
          v-model="selectedCelestialBodies"
          class="celestial-body-select"
          :multiple="isMultiSelect"
        >
          <option v-for="body in celestialBodies" :key="body" :value="body">
            {{ body }}
          </option>
        </select>
      </div>

      <div id="target" ref="target"></div>
    </div>
  </div>
</template>

<style scoped>
.education-container {
  display: flex;
  height: calc(100vh - 50px);
}

.topic-panel {
  width: 30%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
}

.scene-panel {
  width: 70%;
  position: relative;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.toggle-button {
  margin-bottom: 10px;
}

.celestial-body-select {
  width: 150px;
}

#target {
  width: 100%;
  height: 100%;
}

.topic-select {
  margin-bottom: 10px;
  width: 100%;
  padding: 5px;
}
</style>

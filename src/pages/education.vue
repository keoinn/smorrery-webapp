<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { EducationScene } from "@/utils/SpaceScene/EducationScene.js";
import { EmptyTopic } from "@/utils/SpaceScene/topics/EmptyTopic.js";
import { TopicController } from "@/utils/SpaceScene/topics/TopicController.js";
import { Kepler2ndLaw } from "@/utils/SpaceScene/topics/Kepler2ndLaw";
import { Kepler3rdLaw } from "@/utils/SpaceScene/topics/Kepler3rdLaw";
import { Kepler1stLaw } from "@/utils/SpaceScene/topics/Kepler1stLaw";
import { VTweakpane } from "v-tweakpane";
import { useRoute, useRouter } from "vue-router";

const target = ref();
const celestialBodies = ref({});
let education_scene;
const isMultiSelect = ref(true);
const topics = ref([
  new Kepler1stLaw(),
  new Kepler2ndLaw(),
  new Kepler3rdLaw(),
]);
const searchKeyword = ref("");
const topicController = ref(new TopicController(topics.value));
const tweakpaneState = ref({
  selectedBodies: ["Mercury"],
});

const control_st = ref(true);

const timeSpeed = ref(1.0);

const palyingStatuChange = () => {
  control_st.value = !control_st.value;
  if (control_st.value) {
    education_scene.loop.played = 1;
  } else {
    education_scene.loop.played = 0;
  }
};

watch(timeSpeed, (val) => {
  education_scene.loop.timeScaleRate = val;
});

const showFixedSpeedVal = (val) => {
  return parseFloat(val);
};

const paneInstance = ref(null);

const recreatePaneBindings = () => {
  if (paneInstance.value) {
    const pane = paneInstance.value;
    pane.children.forEach((child) => {
      if (child.title === "Select Objects") {
        pane.remove(child);
      }
    });

    const newPane = pane.addFolder({ title: "Select Objects" });
    newPane.addBinding(searchKeyword, "value", { label: "Search" });

    if (isMultiSelect.value) {
      let openTab = null;
      Object.keys(celestialBodies.value).forEach((category, index) => {
        const tab = newPane.addFolder({
          title: category,
          expanded: index === 0,
        });
        tab.on("fold", (ev) => {
          if (ev.expanded && openTab && openTab !== tab) {
            openTab.expanded = false;
          }
          if (ev.expanded) {
            openTab = tab;
          }
        });

        if (index === 0) {
          openTab = tab;
        }

        tab.element.style.width = "250px";

        const params = {};
        celestialBodies.value[category].forEach((name) => {
          params[name] = tweakpaneState.value.selectedBodies.includes(name);
          const binding = tab.addBinding(params, name);

          binding.element.style.width = "100%";

          watch(searchKeyword, (newKeyword) => {
            if (
              newKeyword &&
              !name.toLowerCase().includes(newKeyword.toLowerCase())
            ) {
              binding.hidden = true;
            } else {
              binding.hidden = false;
            }
          });

          binding.on("change", (ev) => {
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
      const binding = newPane.addBinding(params, "selection", {
        options: options,
      });

      binding.on("change", (ev) => {
        tweakpaneState.value.selectedBodies = [ev.value];
      });

      watch(searchKeyword, (newKeyword) => {
        const filteredOptions = Object.entries(options).filter(([key]) =>
          key.toLowerCase().includes(newKeyword.toLowerCase())
        );

        const newOptionValues = filteredOptions.map(([key, value]) => ({
          text: key,
          value: value,
        }));

        binding.controller.valueController.props.set(
          "options",
          newOptionValues
        );
        binding.refresh();
      });
    }
  }
};

const onPaneCreated = (_pane) => {
  paneInstance.value = _pane;
  nextTick(() => {
    const container = document.querySelector(".tweakpane-container");
    if (container && _pane.element.parentElement) {
      container.appendChild(_pane.element);
    }
    const pane = _pane.addFolder({ title: "Select Objects" });
    pane.addBinding(searchKeyword, "value", { label: "Search" });

    if (isMultiSelect.value) {
      let openTab = null;
      Object.keys(celestialBodies.value).forEach((category, index) => {
        const tab = pane.addFolder({
          title: category,
          expanded: false,
        });
        tab.on("fold", (ev) => {
          if (ev.expanded && openTab && openTab !== tab) {
            openTab.expanded = false;
          }
          if (ev.expanded) {
            openTab = tab;
          }
        });
        const params = {};
        celestialBodies.value[category].forEach((name) => {
          params[name] = name === "Mercury";
          const binding = tab.addBinding(params, name);

          watch(searchKeyword, (newKeyword) => {
            if (
              newKeyword &&
              !name.toLowerCase().includes(newKeyword.toLowerCase())
            ) {
              binding.hidden = true;
            } else {
              binding.hidden = false;
            }
          });

          binding.on("change", (ev) => {
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
    recreatePaneBindings();
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
};

const route = useRoute();
const router = useRouter();

const topicIndex = computed(() => {
  const id = parseInt(route.params.topicId) || 0;
  return Math.max(0, Math.min(id, topics.value.length - 1));
});

watch(topicIndex, (newIndex) => {
  if (topicController.value && education_scene) {
    topicController.value.setTopic(topics.value[newIndex], education_scene);
    window.location.reload();
  }
});

onMounted(() => {
  education_scene = new EducationScene(target.value);

  education_scene.addCustomTickFunction((delta, scene, currentDate) => {
    const topic = topicController.value.getCurrentTopic();
    if (topic) {
      topic.tick(delta, scene, currentDate);
    }
  });

  education_scene.start();
  topicController.value.setTopic(
    topics.value[topicIndex.value],
    education_scene
  );
  celestialBodies.value = education_scene.availableCategories;
  watch(tweakpaneState.value, handlePaneChaned);

  education_scene.onCategoriesUpdated = (newCategories) => {
    celestialBodies.value = newCategories;
    nextTick(() => {
      recreatePaneBindings();
    });
  };
});

const changeTopic = (index) => {
  if (index >= 0 && index < topics.value.length) {
    router.push({ name: "Education", params: { topicId: index } });
  }
};

//TODO:
// 2. add topics to navbar
// 5. user can adjust width of the article
// 6. add time control at bottom
// 7. select topic from defined property
// 8. add button to toggle article
// 9. add default object selection to topic
// 10. handle too many objects
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
      <div id="target" ref="target">
        <div id="timeControl">
          <v-btn
            class="video-btn"
            :icon="control_st === true ? `mdi-pause` : `mdi-play`"
            @click="palyingStatuChange"
            size="small"
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
            />
            <span id="speedValue">{{ showFixedSpeedVal(timeSpeed) }}x</span>
          </div>
        </div>
      </div>
      <div class="tweakpane-container">
        <v-tweakpane
          class="p-4"
          :pane="{ title: 'Controller' }"
          @on-pane-created="onPaneCreated"
        />
      </div>
    </div>
    <div class="topic-selector">
      <button
        v-for="(topic, index) in topics"
        :key="index"
        @click="changeTopic(index)"
      >
        {{ topic.name }}
      </button>
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
  margin-top: 120px;
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
      padding-left: 30px;
    }

    input {
      width: 100px;
    }
  }
}

/* 自定義 Tweakpane 樣式 */
:deep(.tp-dfwv) {
  min-width: 250px !important;
}

:deep(.tp-rotv) {
  min-width: 250px !important;
}

:deep(.tp-fldv) {
  min-width: 250px !important;
}

:deep(.tp-brkv) {
  width: 100% !important;
}

:deep(.tp-lblv_v) {
  width: 120px;
}

#speedValue {
  display: inline-block;
  min-width: 45px;
  text-align: center;
}
</style>
<style>
@import "v-tweakpane/dist/v-tweakpane.css";
</style>

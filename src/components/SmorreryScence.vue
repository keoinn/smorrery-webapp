<script setup>
import { ref, onMounted } from "vue";
import { SpaceScene } from "@/utils/SpaceScene/SpaceScene.js";
const target = ref()

onMounted(()=>{
    const target_s = document.querySelector('#target')
    const space_scene = new SpaceScene(target_s)
    space_scene.start()
})
</script>

<template>
  <div id="target" ref="target">
  </div>
</template>

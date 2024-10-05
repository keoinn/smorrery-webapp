<!-- src/components/NEOIntroduction.vue -->
<template>
  <div class="text-center">
    <!-- <h2>NEO Introduction</h2> -->
    <p>這裡是簡單的介紹...</p>
    <v-btn size="x-large" rounded="xl" elevation="8" outlined @click="$emit('enter-timeSelect')">
      View Events
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'NEOIntroduction',
};
</script>

<style scoped>
/* 您的樣式 */
</style>
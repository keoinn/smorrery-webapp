<template>
  <!-- <v-container class="background-image"> -->
    <v-row justify="center" align="center">
        <v-col class="topic text-center">
            <h1>NEO Close-Approach Events</h1>
        </v-col>
    </v-row>
        
    <div v-if="showIntroduction">
        <NEOIntroduction @enter-timeSelect="showIntroduction = false" />
    </div>

    <div v-else>
        <NEOTimeline />
    </div>

  <!-- </v-container> -->
</template>

<script>

import NEOIntroduction from '../components/NEOIntroduction.vue';
import NEOTimeline from '../components/NEOTimeline.vue';

export default {
  components: {
    NEOIntroduction,
    NEOTimeline,
  },
  data() {
    return {
      showIntroduction: true,
    };
  },
};

</script>

<style scoped>

/* .background-image {
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1)), 
                url('../assets/bg-2.jpg');
    background-size: cover; 
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
} */

.topic {
    margin-top: 50px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    letter-spacing: 2px;
}

body {
  font-family: 'Gilroy-Bold', sans-serif;
}
</style>
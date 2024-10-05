<script setup>
import virtual_orrey from '@/assets/images/virtual_orrery.jpeg'

</script>
<template>
  <section class="exploration-hero">
    <h1 class="exploration-title">Look beyond Earth. <br />Explore with us!</h1>
  </section>
  <div class="module-container">
    <div class="submodule submodule-orrery">
      <h1 class="orrery-title">Virtual Orrery</h1>
      <p class="orrery-description">
        Let's explore <br />the Solar System!
      </p>
    </div>
  </div>
  <div>
  </div>
</template>

<style scoped lang="scss">
.exploration-hero {
  max-width: 866px;
  position: relative;
  top: 12%;
  left: 12%;
}

.exploration-title {
  color: #fff;
  font: 800 64px/80px Gilroy, sans-serif;
  letter-spacing: 6.4px;
  padding: 17px 0;
}

.module-container {
  position: relative;
  top: 12%;
  left: 12%;

  .submodule {
    height: 380px;
    border: 2px solid white;
    border-radius: 25px;
  }

  .submodule-orrery {
    padding: 38px 80px 38px 35px;

    width: 480px;
    // background-color: aqua;
    background: v-bind("`no-repeat center/90% url('${virtual_orrey}')`");
  }

  .orrery-title {
  position: relative;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  font-size: 40px;
  line-height: 1;
  letter-spacing: 4px;
}

.orrery-description {
  position: relative;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  font-size: 24px;
  line-height: 35px;
  letter-spacing: 2.4px;
  margin-top: 185px;
}
}


/* 
@media (max-width: 991px) {
  .exploration-title {
    font-size: 40px;
    line-height: 55px;
    max-width: 100%;
    padding-right: 20px;
  }
} */
</style>
<script setup>
import logo_img from "@/assets/gaiaLogo.svg";
</script>

<template>
  <div class="nav-logo" @click="$router.push('/')">
    <div class="group">
      <div class="text-wrapper">Gaia Room</div>
      <img class="vector" alt="Vector" :src="logo_img" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-logo {
  width: 200px;
  height: 50px;
  z-index: 200;
  position: absolute;
  top: 25px;
  left: 50px;

  .group {
    width: 200px;
    height: 54px;
    position: relative;
    top: 25px;
    left: 50px;
    z-index: 200;

    .text-wrapper {
      color: #ffffff;
      font-family: "Gilroy-ExtraBold", Helvetica;
      font-size: 20px;
      font-weight: 800;
      left: 50px;
      letter-spacing: 2px;
      line-height: normal;
      position: absolute;
      top: 0;
    }

    .vector {
      height: 50px;
      left: 0;
      position: absolute;
      top: 4px;
      width: 50px;
    }
  }
}
</style>

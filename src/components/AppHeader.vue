<script setup>
import open_music_img from "@/assets/images/open_music.png";
import { ref } from "vue";

const onClickAbout = () => {
  window.location.href="https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/yue-yuan-ren-tuan-yuan/?tab=members"
  } 
const showEducationDropdown = ref(false);
</script>
<template>
  <div class="navigation-container">
    <div class="navigation-bar">
      <div class="navigation-text text-wrapper-1">
        <span
          @mouseover="showEducationDropdown = true"
          @mouseleave="showEducationDropdown = false"
        >
          Education
          <div v-if="showEducationDropdown" class="education-dropdown">
            <router-link to="/education/0">First</router-link>
            <router-link to="/education/1">Second</router-link>
            <router-link to="/education/2">Third</router-link>
          </div>
        </span>
      </div>
      <div class="navigation-text text-wrapper-2">
        <span @click="$router.push('/events')"> Event </span>
      </div>
      <div class="navigation-text text-wrapper-3">
        <span @click="$router.push('/lab')"> Lab </span>
      </div>
      <div class="navigation-text text-wrapper-4">
        <span @click="$router.push('/challenge')"> Challenge </span>
      </div>
      <div class="navigation-text text-wrapper-5">
        <span @click="$router.push('/tour')"> Tour </span>
      </div>
      <div class="navigation-text text-wrapper-6">
        <span @click="onClickAbout"> About </span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.navigation-container {
  position: absolute;
  background-color: #2f2f2fb2;
  border: 2px solid;
  top: 25px;
  right: 25px;
  border-color: #ffffff;
  border-radius: 25px;
  box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
  height: 50px;
  width: 750px;
  z-index: 100;

  .navigation-bar {
    margin-top: 15px;
    margin-left: 40px;
    height: 25px;
    position: relative;
    width: 660px;
    z-index: 101;
  }

  .navigation-text {
    color: rgba(158, 158, 158, 1);
    font-family: "Gilroy", Helvetica;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    height: 25px;
    letter-spacing: 2px;
    line-height: normal;
    position: absolute;
    text-align: right;
    top: -1px;
    transition: color 0.5s ease-out;
    &:hover {
      cursor: pointer;
      color: white;
    }
  }

  .text-wrapper-1 {
    left: 0;
  }
  .text-wrapper-2 {
    left: 155px;
  }

  .text-wrapper-3 {
    left: 261px;
  }

  .text-wrapper-4 {
    left: 345px;
  }

  .text-wrapper-5 {
    left: 503px;
  }

  .text-wrapper-6 {
    left: 594px;
  }

  .text-wrapper-7 {
    left: 670px;
    top: -5px;
  }

  .education-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #2f2f2fb2;
    border: 1px solid #ffffff;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 200;

    a {
      color: rgba(158, 158, 158, 1);
      text-decoration: none;
      padding: 5px 0;
      transition: color 0.3s ease;

      &:hover {
        color: white;
      }
    }
  }
}
</style>

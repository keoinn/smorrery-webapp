<template>
  <div class="navigation-container">
    <div class="navigation-bar">
      <div class="navigation-text text-wrapper-1">
        <span @click="$router.push('/orrery')"> Education </span>
      </div>
      <div class="navigation-text text-wrapper-2">
        <span @click="$router.push('/events')"> Event </span>
      </div>
      <div class="navigation-text text-wrapper-3">
        <span @click="$router.push('/orrery')"> Lab </span>
      </div>
      <div class="navigation-text text-wrapper-4">
        <span @click="$router.push('/orrery')"> Challenge </span>
      </div>
      <div class="navigation-text text-wrapper-5">
        <span @click="$router.push('/orrery')"> Tour </span>
      </div>
      <div class="navigation-text text-wrapper-6">
        <span @click="$router.push('/orrery')"> About </span>
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
}
</style>

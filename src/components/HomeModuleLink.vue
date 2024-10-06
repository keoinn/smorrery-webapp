<script setup>
import virtual_orrey_img from "@/assets/images/virtual_orrery.jpeg";
import challeng_img from "@/assets/images/challenge.jpeg";
import education_img from "@/assets/images/education.jpeg";
import lab_img from "@/assets/images/lab.jpeg";
import tour_img from "@/assets/images/tour.jpeg";
import event_img from "@/assets/images/event.jpeg";
import background from "@/assets/images/bg.png";
</script>
<template>
  <div class="home-view">
    <section class="exploration-hero">
      <h1 class="exploration-title">
        Look beyond Earth. <br />Explore with us!
      </h1>
    </section>
    <div class="module-container">
      <div class="submodule submodule-orrery" @click="$router.push('/orrery')">
        <h1 class="submodule-title orrery-title">Virtual Orrery</h1>
        <p class="submodule-description orrery-description">
          Let's explore <br />the Solar System!
        </p>
      </div>

      <div class="submodule submodule-event" @click="$router.push('/event')">
        <h1 class="submodule-title event-title">Event</h1>
        <p class="submodule-description event-description">
          The threat <br />of asteroids to Earth
        </p>
      </div>
      <div
        class="submodule submodule-challenge"
        @click="$router.push('/challenge')"
      >
        <h1 class="submodule-title">Challenge</h1>
        <p class="submodule-description challenge-description">
          Test your knowledge!
        </p>
      </div>
    </div>

    <div class="module-container">
      <div class="submodule submodule-lab" @click="$router.push('/lab')">
        <h1 class="submodule-title">Lab</h1>
        <p class="submodule-description lab-description">
          Conduct an<br />experiment<br />
          about stars
        </p>
      </div>

      <div
        class="submodule submodule-education"
        @click="$router.push('/eduaction')"
      >
        <h1 class="submodule-title">Education</h1>
        <p class="submodule-description education-description">
          A better way<br />to present astronomy
        </p>
      </div>

      <div class="submodule submodule-tour" @click="$router.push('/tour')">
        <h1 class="submodule-title">Tour</h1>
        <p class="submodule-description tour-description">
          Let's visit<br />the Solar System's<br />landmarks!
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home-view {
  padding-top: 10vh;
  padding-right: 3vw;
  padding-bottom: 12vh;

  background-image: v-bind(
      "`url('${background}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 106%;
    background-position: 0 0;

  
}
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
  display: flex;
  // top: 12%;
  left: 2vw;
  // justify-content: space-around;
  justify-content: space-between;
  min-width: 70vh;
  margin-top: 3%;
  margin-left: 5%;
  margin-right: 5%;

  .submodule {
    color: white;
    height: 380px;
    border: 2px solid white;
    border-radius: 25px;
    padding: 38px 80px 38px 35px;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    transition: color 0.5s ease-out;
    &.submodule:hover {
      cursor: pointer;
      color: #ffc000;
    }

    .submodule-title {
      position: relative;
      text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
      font-size: 40px;
      line-height: 1;
      letter-spacing: 4px;
    }

    .submodule-description {
      font-family: "Gilroy-Bold";
      position: relative;
      text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
      font-size: 24px;
      line-height: 35px;
      letter-spacing: 2.4px;
    }

    .orrery-description {
      margin-top: 185px;
    }

    .event-description {
      margin-top: 15px;
    }

    .challenge-description {
      margin-top: 75px;
    }

    .lab-description {
      width: 160px;
      margin-top: -40px;
      margin-left: 150px;
    }

    .education-description {
      text-align: right;
      margin-top: 250px;
      width: 340px;
    }
    .tour-description {
      width: 250px;
      text-align: center;
      margin-top: 370px;
    }
  }

  .submodule-orrery {
    width: 468px;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${virtual_orrey_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
  }

  .submodule-event {
    width: 302px;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${event_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
  }

  .submodule-challenge {
    width: 320px;
    height: 235px !important;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${challeng_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 120%;
    background-position: center;
  }

  .submodule-lab {
    width: 351px;
    height: 410px !important;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${lab_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 110%;
    background-position: center;
  }

  .submodule-education {
    width: 420px;
    height: 410px !important;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${education_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 150%;
    background-position: center;
  }

  .submodule-tour {
    width: 320px;
    height: 562px !important;
    margin-top: -13%;
    background: v-bind(
      "`linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, .4)), url('${tour_img}')`"
    );
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 317%;
    background-position: 32% 29%;
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

<script setup>
import font_url from '@/assets/fonts/Gilroy-ExtraBold.otf'
</script>

<template>
  <v-app>
    <v-main>
      <AppHeaderLogo />
      <AppHeader />
      <!-- <AppNavigation /> -->
      <router-view />
    </v-main>

    <!-- <AppFooter /> -->
  </v-app>
</template>

<style>
@font-face {
  font-family: 'Gilroy';
  src: v-bind("`url('${font_url}')`");
}
</style>
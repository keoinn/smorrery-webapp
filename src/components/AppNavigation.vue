<script setup>
import { ref, watch, onMounted } from "vue";
import {useAppStore} from '@/stores/app.js'
const appStore = useAppStore()
const rail = ref(false);

</script>

<template>
  <v-navigation-drawer
    :rail="appStore.isOpenNav"
    permanent
    @click="rail = false"
  >
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-city"
        title="Home"
        value="home"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        title="My Account"
        value="account"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group-outline"
        title="Users"
        value="users"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

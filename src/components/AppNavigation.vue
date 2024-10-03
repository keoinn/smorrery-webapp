<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
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

<script setup>
import { ref } from "vue";
const drawer = ref(false);
const rail = ref(false);
</script>

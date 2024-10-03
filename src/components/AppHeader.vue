<script setup>
// export default {
//   data: () => ({
//     user: {
//       initials: "JD",
//       fullName: "John Doe",
//       email: "john.doe@doe.com",
//     },
//   }),
// };
import { reactive } from "vue";
const user = reactive({
    initials: "JD",
    fullName: "John Doe",
    email: "john.doe@doe.com",
})
</script>

<template>
  <v-app-bar class="px-1">
      <v-app-bar-nav-icon icon="mdi-menu"></v-app-bar-nav-icon>
      <v-app-bar-title>Smorrery WebApp</v-app-bar-title>
    <!-- <v-text-field prepend-icon="mdi-magnify" single-line></v-text-field> -->

    <!-- <v-menu min-width="150px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="brown" size="large">
            <span class="text-h5">{{ user.initials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5">{{ user.initials }}</span>
            </v-avatar>
            <h3>{{ user.fullName }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text"> Edit Account </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text"> Disconnect </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu> -->
  </v-app-bar>
</template>


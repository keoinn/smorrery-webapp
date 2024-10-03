// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'app',
  () => {
    const isOpenNav = ref(true)

    const changeOpenNav = () => {
      isOpenNav.value = !isOpenNav.value
      console.log("changeOpenNav", isOpenNav.value)
    }

    return {
      isOpenNav,
      changeOpenNav,
    }
  }
)

<template>
    <div class="demo"></div>
</template>

<script setup>
import lab from '@/assets/images/lab.jpg'

</script>

<style scoped lang="scss">
    .demo {
        width: 100vw;
        height: 100vh;
        background: v-bind(
            "`url('${lab}')`"
        );
        box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
        background-repeat: no-repeat;
        background-size: 90%;
        background-position: center;
    }
</style>
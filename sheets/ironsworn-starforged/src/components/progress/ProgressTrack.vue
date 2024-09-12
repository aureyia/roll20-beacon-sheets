<script setup lang="ts">
import { ref } from 'vue';
// import ProgressBox from './ProgressBox.vue';

const boxNumber = new Array(10)

const progressArray = {
  box_1: ref(0),
  box_2: ref(0),
  box_3: ref(0),
  box_4: ref(0),
  box_5: ref(0),
  box_6: ref(0),
  box_7: ref(0),
  box_8: ref(0),
  box_9: ref(0),
  box_10: ref(0)
}

const nom = ref(0)

// TODO: Complete ProgressTrack

</script>

<template>
  <div class="progress-track">
    <ProgressBox v-for="n in boxNumber" :key="n" />
  </div>
</template>

<style lang="sass">

</style>
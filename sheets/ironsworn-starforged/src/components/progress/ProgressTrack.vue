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
  <div class="progress-track flex justify-between gap-2">
    <div class="progress-box gap-2 flex items-center">
      <Button variant="outline" class="h-8 border-primary border-2 font-bold">Mark</Button>
      <Button variant="outline" class="h-8 border-primary border-2 font-bold">Clear</Button>
    </div>
    <ProgressBox v-for="n in boxNumber" :key="n" />
    <div class="progress-box flex items-center">
      <Button variant="outline" class="h-8 border-primary border-2 font-bold w-20">Fulfill</Button>
    </div>
  </div>
</template>

<style lang="sass">

</style>
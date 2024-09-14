<script setup lang="ts">
import { ProgressBox } from '@/components/progress';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';

const boxNumber = new Array(10)
const taskStore = useTaskStore()

// TODO: Complete ProgressTrack

</script>

<template>
  <div class="progress-track flex justify-between gap-2 flex-wrap">
    <div class="progress-box gap-4 flex items-center">
      <Button variant="outline" class="h-8 w-20 border-primary bg-muted border-2 font-bold">Mark</Button>
      <Button variant="outline" class="h-8 w-20 border-primary bg-muted border-2 font-bold">Clear</Button>
    </div>
    <div class="flex gap-2 mt-1">
      <ProgressBox v-for="n in boxNumber" :key="n"/>
    </div>
    <div class="progress-box flex items-center">
      <Button variant="outline" class="h-8 border-primary bg-muted border-2 font-bold w-24">Fulfill</Button>
    </div>
  </div>
</template>

<style lang="sass">

</style>
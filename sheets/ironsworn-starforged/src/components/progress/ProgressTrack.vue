<script setup lang="ts">
import { ProgressBox } from '@/components/progress';
import { useTaskStore, type Task } from '@/sheet/stores/chronicle/tasksStore';
import { progressTicksToFill } from '@/utility/progressTicksToFill';

const BOXES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
const taskStore = useTaskStore()

defineProps({ task: { type: Object, default: {} } })
</script>

<template>
  <div class="progress-track flex justify-between gap-2 flex-wrap">
    <div class="progress-box gap-4 flex items-center">
      <Button
        @click="taskStore.markProgress(task._id as string)"
        variant="outline" 
        class="h-8 w-20 border-primary bg-muted border-2 font-bold"
        >Mark</Button>
      <Button
        @click="taskStore.clearProgress(task._id as string)"
        variant="outline" 
        class="h-8 w-20 border-primary bg-muted border-2 font-bold"
        >Clear</Button>
    </div>
    <div class="flex gap-2 mt-1">
      <ProgressBox 
        v-for="value, index in BOXES" 
        :key="index" 
        :id="task._id"
        :ticks="progressTicksToFill(index)(task.progress).toString()"
      />
    </div>
    <div class="progress-box flex items-center">
      <Button 
        @click="taskStore.roll(task._id as string)"
        variant="outline"
        class="h-8 border-primary bg-muted border-2 font-bold w-24"
      >Fulfill</Button>
    </div>
  </div>
</template>

<style lang="sass">

</style>
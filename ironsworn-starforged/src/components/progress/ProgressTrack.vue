<script setup lang="ts">
import { ProgressBox } from '@/components/progress/progress_components'
import { progressTicksToFill } from '@/system/tasks_utils'
import { type Task, store_tasks } from '@/system/tasks_store'

const BOXES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
const taskStore = store_tasks.get().context.list

defineProps({ task: { type: Object, default: {} } })
</script>

<template>
  <div class="progress-track flex flex-wrap justify-between gap-2">
    <div class="progress-box flex items-center gap-4">
      <Button
        @click="taskStore.markProgress(task._id as string)"
        variant="outline"
        class="border-primary bg-muted h-8 w-20 border-2 font-bold"
        >Mark</Button
      >
      <Button
        @click="taskStore.clearProgress(task._id as string)"
        variant="outline"
        class="border-primary bg-muted h-8 w-20 border-2 font-bold"
        >Clear</Button
      >
    </div>
    <div class="mt-1 flex gap-2">
      <ProgressBox
        v-for="(value, index) in BOXES"
        :key="index"
        :id="task._id"
        :ticks="progressTicksToFill(index, task.progress).toString()"
      />
    </div>
    <div class="progress-box flex items-center">
      <Button
        @click="taskStore.roll(task._id as string)"
        variant="outline"
        class="border-primary bg-muted h-8 w-24 border-2 font-bold"
        >Fulfill</Button
      >
    </div>
  </div>
</template>

<style lang="sass"></style>

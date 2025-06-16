<script setup lang="ts">
import { ProgressCard } from '@/components/progress'
import { ProgressDialog } from '@/components/progress'
import { Toggle } from '@/components/ui/toggle'
import { tasksStore } from '@/system/tasks/store'
import { ref, provide } from 'vue'

const tasks = ref(tasksStore.get().context.list)
const removeMode = ref(false)

tasksStore.subscribe(snapshot => {
    tasks.value = snapshot.context.list
})

const TASK_CATEGORIES = ['vow'] as const
provide('categories', TASK_CATEGORIES)
</script>

<template>
  <div class="progress-view">
    <div class="mx-14 flex justify-between">
      <ProgressDialog />
      <Toggle
        class="border-primary data-[state=on]:bg-destructive h-8 w-24 border-2 font-bold"
        v-model:pressed="removeMode"
        >Remove
      </Toggle>
    </div>
    <ProgressCard
      v-for="task in tasks.filter((task) => task.category === 'vow')"
      :removeMode="removeMode"
      :task="task"
    />
  </div>
</template>

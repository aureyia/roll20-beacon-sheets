<script setup lang="ts">
import { ProgressCard } from '@/components/progress';
import { ProgressDialog } from '@/components/progress';
import { Toggle } from '@/components/ui/toggle';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';
import { ref, provide } from 'vue';

const taskStore = useTaskStore()
const removeMode = ref(false)

const TASK_CATEGORIES = ['vow'] as const;
provide('categories', TASK_CATEGORIES)
</script>

<template>
  <div class="progress-view">
    <div class="flex justify-between mx-14">
      <ProgressDialog />
      <Toggle class="h-8 w-24 border-primary border-2 data-[state=on]:bg-destructive font-bold" v-model:pressed="removeMode">Remove </Toggle>
    </div>
    <ProgressCard v-for="task in taskStore.tasks.filter(task => task.category === 'vow')" :removeMode="removeMode" :task="task"/>
  </div>
</template>
<script setup lang="ts">
import { ProgressCard } from '@/components/progress';
import { ProgressDialog } from '@/components/progress';
import { Toggle } from '@/components/ui/toggle';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';
import { ref } from 'vue';

const taskStore = useTaskStore()
const getTaskById = (id: string) => taskStore.tasks.find(task => task._id === id)

const removeMode = ref(false)
</script>

<template>
  <div class="progress-view">
    <div class="flex justify-between mx-14">
      <ProgressDialog />
      <Toggle class="h-8 w-24 border-primary border-2 data-[state=on]:bg-destructive font-bold" v-model:pressed="removeMode">Remove </Toggle>
    </div>
    <div>
      Tasks: {{ taskStore.tasks }}
    </div>
    <ProgressCard v-for="task in taskStore.tasks" :id="task._id" :removeMode="removeMode" :task="task"/>
  </div>
</template>
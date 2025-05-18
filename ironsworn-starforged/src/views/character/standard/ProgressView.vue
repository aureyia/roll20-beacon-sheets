<script setup lang="ts">
import { ProgressCard } from '@/components/progress';
import { ProgressDialog } from '@/components/progress';
import { Toggle } from '@/components/ui/toggle';
import { useTaskStore } from '@/internal/tasks/infrastructure/store';
import { ref, provide } from 'vue';

const taskStore = useTaskStore();
const removeMode = ref(false);
const TASK_CATEGORIES = ['generic', 'challenge'] as const;

provide('categories', TASK_CATEGORIES);
</script>

<template>
  <div class="progress-view">
    <div class="mx-14 flex justify-between">
      <ProgressDialog />
      <Toggle
        class="h-8 w-24 border-2 border-primary font-bold data-[state=on]:bg-destructive"
        v-model:pressed="removeMode"
        >Remove
      </Toggle>
    </div>
    <ProgressCard
      v-for="task in taskStore.tasks.filter(
        (task) => task.category === 'generic' || task.category === 'challenge',
      )"
      :removeMode="removeMode"
      :task="task"
    />
  </div>
</template>

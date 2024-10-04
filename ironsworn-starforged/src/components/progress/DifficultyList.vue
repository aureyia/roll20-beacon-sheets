<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ref } from 'vue';
import { useTaskStore, type Difficulty } from '@/sheet/stores/chronicle/tasksStore';
import { DIFFICULTIES } from '@/system/tasks';

const taskStore = useTaskStore();

defineProps({ id: String });
defineModel('selectedDifficulty', { type: String });
</script>

<template>
  <div class="difficulty-list mt-2">
    <ToggleGroup
      type="single"
      :modelValue="taskStore.tasks.find((task) => task._id === id)?.difficulty"
      class="justify-between"
    >
      <ToggleGroupItem
        class="bg-neutral-card-button h-8 w-44 font-bold uppercase hover:border-2 hover:border-muted-foreground hover:bg-card-button hover:text-primary data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-card-button"
        v-for="difficulty in DIFFICULTIES"
        @click="taskStore.updateDifficulty(id as string, difficulty)"
        :key="difficulty"
        :value="difficulty"
        >{{ difficulty }}</ToggleGroupItem
      >
    </ToggleGroup>
  </div>
</template>

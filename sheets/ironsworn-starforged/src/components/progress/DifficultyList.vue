<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ref } from 'vue';
import { useTaskStore , type Difficulty } from '@/sheet/stores/chronicle/tasksStore';
import { DIFFICULTIES } from '@/system/tasks';

const taskStore = useTaskStore()

defineProps({id: String,})
defineModel('selectedDifficulty', { type: String })
</script>

<template>
  <div class="difficulty-list mt-2">
    <ToggleGroup type="single" :modelValue="taskStore.tasks.find(task => task._id === id)?.difficulty" class="justify-between">
      <ToggleGroupItem
        class="font-bold hover:border-2 hover:text-primary hover:border-muted-foreground hover:bg-card-button bg-neutral-card-button data-[state=on]:bg-card-button data-[state=on]:border-2 data-[state=on]:border-primary  uppercase w-44 h-8" 
        v-for="difficulty in DIFFICULTIES"
        @click="taskStore.updateDifficulty(id as string, difficulty)"
        :key="difficulty" 
        :value="difficulty"
      >{{ difficulty }}</ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
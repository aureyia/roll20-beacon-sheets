<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ref } from 'vue';
import { tasksStore } from '@/system/tasks/store';
import { DIFFICULTIES } from '@/system/tasks/types';

defineProps({ id: String });
defineModel('selectedDifficulty', { type: String });
</script>

<template>
  <div class="difficulty-list mt-2">
    <ToggleGroup
      type="single"
      :modelValue="
        tasksStore.get().context.list.find((task) => task._id === id)
          ?.difficulty
      "
      class="justify-between"
    >
      <ToggleGroupItem
        class="bg-neutral-card-button hover:border-muted-foreground hover:bg-card-button hover:text-primary data-[state=on]:border-primary data-[state=on]:bg-card-button h-8 w-44 font-bold uppercase hover:border-2 data-[state=on]:border-2"
        v-for="difficulty in DIFFICULTIES"
        @click="
          tasksStore.trigger.update({ label: 'difficulty', id, difficulty })
        "
        :key="difficulty"
        :value="difficulty"
        >{{ difficulty }}</ToggleGroupItem
      >
    </ToggleGroup>
  </div>
</template>

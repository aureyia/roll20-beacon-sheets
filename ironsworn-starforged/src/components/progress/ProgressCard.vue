<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProgressTrack from '@/components/progress/ProgressTrack.vue';
import Input from '@/components/ui/input/Input.vue';
import DifficultyList from '@/components/progress/DifficultyList.vue';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';

const taskStore = useTaskStore();

const props = defineProps({
  removeMode: Boolean,
  task: { type: Object, default: {} },
});
</script>

<template>
  <div class="progress-card">
    <Card class="mx-14 mt-3 drop-shadow">
      <CardHeader class="px-6 pb-2 pt-4">
        <div>
          <Transition>
            <Button
              v-if="removeMode"
              variant="destructive"
              class="mb-2 h-8 w-24 border-2 border-primary font-bold text-primary"
              @click="taskStore.removeTask(task._id as string)"
              >Delete</Button
            >
          </Transition>
          <Input v-model="task.description" class="h-10 bg-card-input text-lg drop-shadow-sm" />
        </div>
        <DifficultyList v-model:selectedDifficulty="task.difficulty" :id="task._id" />
      </CardHeader>
      <CardContent>
        <ProgressTrack :task="task" :id="task._id" />
      </CardContent>
    </Card>
  </div>
</template>

<style lang="sass" scoped>
.v-enter-active,
.v-leave-active
  transition: opacity 0.5s ease

.v-enter-from,
.v-leave-to
  opacity: 0
</style>

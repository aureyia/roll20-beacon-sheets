<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import ProgressTrack from '@/components/progress/ProgressTrack.vue';
import Input from '@/components/ui/input/Input.vue';
import DifficultyList from '@/components/progress/DifficultyList.vue';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';

const taskStore = useTaskStore()

defineProps({
  id: String,
  task: { type: Object, default: {} },
  removeMode: Boolean
})
</script>

<template>
  <div class="progress-card">
    <Card class=" mx-14 mt-3 drop-shadow border-primary">
      <CardHeader class="pt-4 pb-2 px-6">
        <div>
          <Transition>
            <Button
              v-if="removeMode"
              variant="destructive"
              class="mb-2 h-8 w-24 border-primary border-2 font-bold text-primary"
              @click="taskStore.removeTask(id as string)"
              >Delete</Button>
            </Transition>
          <Input class="bg-card-input border-primary h-10 text-lg"/>
        </div>
        <DifficultyList v-model:selectedDifficulty="task.difficulty" :id="task._id"/>
      </CardHeader>
      <CardContent>
        <ProgressTrack />
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
<script setup lang="ts">
import { ProgressCard } from '@/components/progress';
</script>

<template>
  <div class="progress-view">
    <div class="flex justify-between mx-14">
      <Button variant="outline" class="h-8 w-24 border-primary border-2 font-bold">Add</Button>
      <Button variant="outline" class="h-8 w-24 border-primary border-2 font-bold">Remove</Button>
    </div>
    <ProgressCard />
  </div>
</template>
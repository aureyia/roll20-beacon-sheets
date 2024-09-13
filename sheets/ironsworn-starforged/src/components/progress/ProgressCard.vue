<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ProgressTrack from '@/components/progress/ProgressTrack.vue';
import Input from '@/components/ui/input/Input.vue';
import DifficultyList from '@/components/progress/DifficultyList.vue';

const difficulties = [ 'troublesome', 'dangerous', 'formidable', 'extreme', 'epic' ]

</script>

<template>
  <div class="progress-card">
    <Card class="mx-14 mt-3 bg-muted border-0 drop-shadow border-primary">
      <CardHeader>
        <div>
          <Input class="bg-input border-2 border-primary h-12 text-lg"/>
        </div>
        <DifficultyList />
      </CardHeader>
      <CardContent>
        <ProgressTrack />
      </CardContent>
    </Card>
  </div>
</template>
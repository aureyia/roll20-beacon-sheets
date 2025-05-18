<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStatsStore } from '@/internal/stats/infrastructure/store';

const stats = useStatsStore();

defineProps({
  name: {
    type: String,
    required: true,
  },
  stat: {
    type: Number,
    required: true,
  },
  numberStyle: {
    type: String,
  },
});
</script>

<template>
  <div class="mode-card min-w-44 text-center">
    <Card
      @click="stats.roll(name, stat)"
      class="cursor-pointer bg-muted uppercase shadow drop-shadow hover:bg-muted-accent"
    >
      <CardHeader>
        <CardTitle i18n="">{{ name }}</CardTitle>
      </CardHeader>
      <CardContent i18n="" :class="numberStyle">{{ stat }}</CardContent>
    </Card>
  </div>
</template>

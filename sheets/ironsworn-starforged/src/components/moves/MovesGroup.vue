<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  group: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="moves-group mb-3 break-inside-avoid-column">
    <Card class="px-2 m-0 h-full">
      <CardHeader class="p-1 mt-2 mb-1">
        <CardTitle>{{ group.Name }}</CardTitle>
      </CardHeader>
      <CardContent v-for="move in group.Moves" class="p-0 mt flex">
        <span class="mr-3">Roll</span>
        <span>{{ move.Name }}</span>
      </CardContent>
    </Card>
  </div>
</template>
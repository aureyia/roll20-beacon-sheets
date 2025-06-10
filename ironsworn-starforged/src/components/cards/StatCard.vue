<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      @click=""
      class="cursor-pointer bg-muted uppercase shadow drop-shadow-sm hover:bg-muted-accent"
    >
      <CardHeader>
        <CardTitle i18n="">{{ name }}</CardTitle>
      </CardHeader>
      <CardContent i18n="" :class="numberStyle">{{ stat }}</CardContent>
    </Card>
  </div>
</template>

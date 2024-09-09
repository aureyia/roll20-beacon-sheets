<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useStatsStore } from '@/sheet/stores/stats/statsStore';

const stats = useStatsStore()

defineProps({
  name: {
    type: String,
    required: true
  },
  stat: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="mode-card min-w-36 text-center">
    <Card @click="stats.roll(name, stat)" class="cursor-pointer drop-shadow shadow bg-slate-900 hover:bg-slate-800">
      <CardHeader>
        <CardTitle i18n="">{{ name }}</CardTitle>
      </CardHeader>
      <CardContent i18n="">{{ stat }}</CardContent>
    </Card>
  </div>
</template>
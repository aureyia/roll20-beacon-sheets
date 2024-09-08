<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useStatsStore } from '@/sheet/stores/stats/statsStore';

const statsStore = useStatsStore()
const stats = computed(() => statsStore.stats)

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
    <Card @click="statsStore.roll(name, stat)" class="cursor-pointer hover:bg-slate-800">
      <CardHeader>
        <CardTitle i18n="">{{ name }}</CardTitle>
      </CardHeader>
      <CardContent i18n="">{{ stat }}</CardContent>
    </Card>
  </div>
</template>
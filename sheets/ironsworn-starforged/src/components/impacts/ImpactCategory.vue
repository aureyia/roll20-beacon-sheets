<script setup lang="ts">
import { ImpactList } from '@/components/impacts'
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';
import { type Impact } from '@/system/impacts';
import { useAttrs } from 'vue'
const attrs = useAttrs()

console.log(attrs)

defineProps({
  label: {
    type: String,
    required: true
  }
})

const impacts = useImpactsStore()
</script>

<template>
  <div class="impact-category w-full">
    <div class="impact-category-label">{{ label }}</div>
    <ImpactList :label="label" v-bind="$attrs" />
  </div>
</template>

<style lang="sass" scoped>

</style>

<script setup lang="ts">
import { ImpactList } from '@/components/impacts';
import { useImpactsStore } from '@/internal/impacts/infrastructure/impactsStore';
import { type Impact } from '@/internal/impacts/application/impacts';
import { useAttrs } from 'vue';
const attrs = useAttrs();

console.log(attrs);

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const impacts = useImpactsStore();
</script>

<template>
  <div class="impact-category w-full">
    <div class="impact-category-label">{{ label }}</div>
    <ImpactList :label="label" v-bind="$attrs" />
  </div>
</template>

<style lang="sass" scoped></style>

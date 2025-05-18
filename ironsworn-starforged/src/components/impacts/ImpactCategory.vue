<script setup lang="ts">
import { ImpactList } from '@/components/impacts';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <div class="impact-category w-full">
    <div class="impact-category-label">{{ label }}</div>
    <ImpactList :label="label" v-bind="$attrs" />
  </div>
</template>

<style lang="sass" scoped></style>

<script setup lang="ts">
import { useStarforgedSheetStore } from './sheet/stores';

const store = useStarforgedSheetStore();
const campaignId = store.meta.campaignId;
const navList = [
  'summary',
  'moves',
  'oracles',
  'vows',
  'ship',
  'assets',
  'progress',
  'connections',
  'legacies',
  'settings',
]
</script>

<template>
  <Button>Click me</Button>
</template>
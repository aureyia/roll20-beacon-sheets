<script setup lang="ts">
import { settingsStore } from "@/system/settings/store";

const modeList = [
  'character-standard',
  'character-edge',
  'guide',
  'locations',
  'oracles',
  'shared',
  'ship',
];

</script>

<template>
  <div class="mode">
    <div>
      <h3 class="mb-4 text-center text-2xl">Modes</h3>
    </div>
    <div class="mode-select flex flex-wrap justify-center gap-2">
      <ModeCard v-for="mode in modeList" :key="mode" :mode="mode" />
    </div>
  </div>
</template>

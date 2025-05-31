<script setup lang="ts">
// import { metaStore } from "@/external/store";
// import { characterStore } from "@/system/character/store";
// import { resourcesStore } from "@/system/resources/store";
// import { impactsStore } from "@/system/impacts/store";
// import { momentumStore } from "@/system/momentum/store";
// import { assetsStore } from "@/system/assets/store";
// import { statsStore } from "@/system/stats/store";
// import { tasksStore } from "@/system/tasks/store";
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
      {{ settingsStore.get().context }}
    </div>
    <div>
      <h3 class="mb-4 text-center text-2xl">Modes</h3>
    </div>
    <div class="mode-select flex flex-wrap justify-center gap-2">
      <ModeCard v-for="mode in modeList" :key="mode" :mode="mode" />
    </div>
  </div>
</template>

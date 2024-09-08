<script setup lang="ts">

const modeList = [
  'character-standard',
  'character-edge',
  'guide',
  'locations',
  'oracles',
  'shared',
  'ship'
]

</script>

<template>
  <div class="mode">
    <div>
      <h3 class="text-2xl text-center mb-4">Modes</h3>
    </div>
    <div class="mode-select flex flex-wrap gap-2 justify-center">
      <ModeCard  v-for="mode in modeList" :key="mode" :mode="mode"/>
    </div>
  </div>
</template>
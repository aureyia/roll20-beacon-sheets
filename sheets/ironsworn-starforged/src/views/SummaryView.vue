
<template>
  <div class="summary">
    <CharacterStats />
    <CharacterImpacts />
    <CharacterChronicle />
  </div>
</template>
  
<script setup>
import CharacterStats from '@/components/stats/CharacterStats.vue';
import CharacterImpacts from '@/components/impacts/CharacterImpacts.vue';
import CharacterChronicle from '@/components/chronicle/CharacterChronicle.vue';
</script>

<style lang="scss">
</style>
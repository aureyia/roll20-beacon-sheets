<template>
  <div class="stat-editor col" v-for="(value, label) in stats" :key="label">
    <h5 class="stats-title i18n-text" :data-i18n="`stat-${label}`">{{ capitalizeFirstLetter(label) }}</h5>
    <div class="stats-input-container">
      <q-input filled type="text" class="stats-input" v-model.number="stats[label]" @update:model-value="() => updateStat(label, stats[label])"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '../../sheet/stores/stats/statsStore';

const statsStore = useStatsStore();
const stats = computed(() => statsStore.stats);

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const updateStat = (label: string, value: number) => {
  statsStore.stats = {
    ...statsStore.stats,
    [label]: value,
  };
};
</script>

<style scoped lang="sass">
.stats-input-container
  display: flex
  justify-content: center

.stats-title
  text-align: center
  margin: 0
  margin-bottom: 0.4em

div.stat-editor
  width: 7em
  justify-content: center

.stats-input
  width: 4em 
  text-align-last: center
  border: 2px solid $primary
</style>

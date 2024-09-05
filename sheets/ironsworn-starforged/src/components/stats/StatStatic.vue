<template>
  <div class="stats-static col" v-for="(value, label) in stats" :key="label">
    <q-btn rounded text-color="primary" size="2em" class="stat-button" @click="statsStore.roll(label, value)">
      <div class="stats-title i18n-text" :data-i18n="`stat-${label}`">
        {{ capitalizeFirstLetter(label) }}
        <br>
        {{ value }}
      </div>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '../../sheet/stores/stats/statsStore';

const statsStore = useStatsStore();
const stats = computed(() => statsStore.stats);

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped lang="sass">
.stats-static
  text-align: center

.stat-button
  min-width: 5em

.stats-title
  font-size: 0.9em
</style>
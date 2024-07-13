<template>
  <div class="stats-static">
    <div class="stat" v-for="(value, label) in stats" :key="label">
      <div class="stats-title i18n-text" :data-i18n="`stat-${label}`">{{ capitalizeFirstLetter(label) }}</div>
      <q-input
        class="stat-input"
        v-model.number="stats[label]"
        type="number"
        filled
        @change="(value: number) => updateStat(label, value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useStatsStore } from '../../sheet/stores/stats/statsStore'

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

<style scoped lang="scss">
.stats-static {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.stat {
  width: fit-content;
  justify-content: center;
  align-items: center;
  margin: 1em;
}

.stat-input {
  padding: 0.2em;
  width: 6em;
}
</style>
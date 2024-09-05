import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import rollStat from '@/utility/rollStat';
import { useCharacterStore } from '../character/characterStore';

export type StatsHydrate = {
  stats: {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
  };
};

export const useStatsStore = defineStore('stats', () => {
  const edge = ref(0);
  const heart = ref(0);
  const iron = ref(0);
  const shadow = ref(0);
  const wits = ref(0);

  const stats = computed({
    get() {
      return {
        edge: edge.value,
        heart: heart.value,
        iron: iron.value,
        shadow: shadow.value,
        wits: wits.value,
      };
    },
    set(newStats) {
      edge.value = newStats.edge ?? edge.value;
      heart.value = newStats.heart ?? heart.value;
      iron.value = newStats.iron ?? iron.value;
      shadow.value = newStats.shadow ?? shadow.value;
      wits.value = newStats.wits ?? wits.value;
    },
  });


  const roll = async (stat: string, value: number, modifier: number = 0) => {
    const { momentum } = useCharacterStore();
    await rollStat(stat, value, momentum, modifier);
  };

  const dehydrate = () => {
    return { stats: stats.value };
  };

  const hydrate = (hydrateStore: StatsHydrate) => {
    stats.value = hydrateStore.stats;
  };

  return {
    stats,
    roll,
    dehydrate,
    hydrate,
  };
});

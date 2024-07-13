import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type StatsHydrate = {
  stats: {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
  };
};

// export type Stat = 'edge' | 'heart' | 'iron' | 'shadow' | 'wits';

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
    set(stats) {
      edge.value = stats.edge || edge.value;
      heart.value = stats.heart || heart.value;
      iron.value = stats.iron || iron.value;
      shadow.value = stats.shadow || shadow.value;
      wits.value = stats.wits || wits.value;
    },
  });

  const dehydrate = () => {
    return { stats: stats.value };
  };

  const hydrate = (hydrateStore: StatsHydrate) => {
    stats.value = hydrateStore.stats;
  };

  return {
    stats,
    dehydrate,
    hydrate,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import rollStat from '@/utility/rollStat';
import { useResourcesStore } from '../resources/resourcesStore';

export type Stats = {
  edge: number;
  heart: number;
  iron: number;
  shadow: number;
  wits: number;
}

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

  const roll = async (stat: string, value: number, modifier: number = 0) => {
    const { momentum } = useResourcesStore();
    await rollStat(stat, value, momentum, modifier);
  };

  const dehydrate = () => {
    return { 
      stats: {
        edge: edge.value,
        heart: heart.value,
        iron: iron.value,
        shadow: shadow.value,
        wits: wits.value,
      }
    };
  };

  const hydrate = (hydrateStore: StatsHydrate) => {
    edge.value = hydrateStore.stats.edge ?? edge.value;
    heart.value = hydrateStore.stats.heart ?? heart.value;
    iron.value = hydrateStore.stats.iron ?? iron.value;
    shadow.value = hydrateStore.stats.shadow ?? shadow.value;
    wits.value = hydrateStore.stats.wits ?? wits.value;
  };

  return {
    edge,
    heart,
    iron,
    shadow,
    wits,
    roll,
    dehydrate,
    hydrate,
  };
});

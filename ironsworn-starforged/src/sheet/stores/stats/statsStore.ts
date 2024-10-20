import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';

export type Stats = {
  edge: number;
  heart: number;
  iron: number;
  shadow: number;
  wits: number;
};

export type StatsHydrate = {
  stats: {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
  };
};

const assertStoreValues = (values: any) => {
  assert(typeof values.edge === 'number', `values.edge type: ${typeof values.edge}`);
  assert(typeof values.heart === 'number', `values.heart type: ${typeof values.heart}`);
  assert(typeof values.iron === 'number', `values.edge type: ${typeof values.iron}`);
  assert(typeof values.shadow === 'number', `values.edge type: ${typeof values.shadow}`);
  assert(typeof values.wits === 'number', `values.edge type: ${typeof values.wits}`);
};

export const useStatsStore = defineStore('stats', () => {
  const edge = ref(0);
  const heart = ref(0);
  const iron = ref(0);
  const shadow = ref(0);
  const wits = ref(0);

  const dehydrate = () => {
    const stats = {
      edge: edge.value,
      heart: heart.value,
      iron: iron.value,
      shadow: shadow.value,
      wits: wits.value,
    };

    assertStoreValues(stats);
    return Effect.succeed({ stats });
  };

  const hydrate = (hydrateStore: StatsHydrate) => {
    assertStoreValues(hydrateStore.stats);

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
    dehydrate,
    hydrate,
  };
});

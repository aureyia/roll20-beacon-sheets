import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  assert(isNumberBetween(momentum, -6, 10), `values.momentum: ${momentum}`);
};

export const useMomentumStore = defineStore('momentum', () => {
  const momentum = ref(2);

  const dehydrate = () => {
    assertMomentum(momentum.value);
    return Effect.succeed({ momentum: momentum.value });
  };

  const hydrate = (hydrateStore: MomentumHydrate) => {
    assertMomentum(hydrateStore.momentum);
    momentum.value = hydrateStore.momentum ?? momentum.value;
  };

  return {
    momentum,
    dehydrate,
    hydrate,
  };
});

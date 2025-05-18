import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useImpactsStore } from '@/internal/impacts/infrastructure/store';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  assert(
    isNumberBetween(momentum, -6, 10),
    `values.momentum: ${momentum}`,
  );
};

export const useMomentumStore = defineStore('momentum', () => {
  const impacts = useImpactsStore();

  const momentum = ref(2);
  const momentumMax = computed(() =>
    impacts.list.length > 10 ? 0 : 10 - impacts.list.length,
  );
  const momentumReset = computed(() =>
    impacts.list.length === 1 ? 1 : impacts.list.length >= 2 ? 0 : 2,
  );

  const dehydrate = () => {
    assertMomentum(momentum.value)
    return Effect.succeed(momentum.value);
  };

  const hydrate = (hydrateStore: MomentumHydrate) => {
    assertMomentum(hydrateStore.momentum)
    momentum.value = hydrateStore.momentum ?? momentum.value;
  };

  return {
    momentum,
    momentumMax,
    momentumReset,
    dehydrate,
    hydrate,
  };
});

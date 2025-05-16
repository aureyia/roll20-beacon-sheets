import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useImpactsStore } from '@/internal/impacts/infrastructure/impactsStore';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';

export type ResourcesHydrate = {
  resources: {
    health: number;
    spirit: number;
    supply: number;
    xp: number;
    spentXp: number;
    momentum: number;
  };
};

const assertStoreValues = (values: any) => {
  assert(
    isNumberBetween(values.health, 0, 5),
    `values.health: ${values.health}`,
  );
  assert(
    isNumberBetween(values.spirit, 0, 5),
    `values.spirit: ${values.spirit}`,
  );
  assert(
    isNumberBetween(values.supply, 0, 5),
    `values.supply: ${values.supply}`,
  );
  assert(
    isNumberBetween(values.momentum, -6, 10),
    `values.momentum: ${values.momentum}`,
  );
  assert(values.xp >= 0, `values.xp: ${values.xp}`);
  assert(values.spentXp >= 0, `values.spentXp: ${values.spentXp}`);
};

export const useResourcesStore = defineStore('resources', () => {
  const impacts = useImpactsStore();

  const health = ref(5);
  const spirit = ref(5);
  const supply = ref(5);
  const xp = ref(0);
  const spentXp = ref(0);
  const momentum = ref(2);
  const momentumMax = computed(() =>
    impacts.list.length > 10 ? 0 : 10 - impacts.list.length,
  );
  const momentumReset = computed(() =>
    impacts.list.length === 1 ? 1 : impacts.list.length >= 2 ? 0 : 2,
  );

  const dehydrate = () => {
    const resources = {
      health: health.value,
      spirit: spirit.value,
      supply: supply.value,
      xp: xp.value,
      spentXp: spentXp.value,
      momentum: momentum.value,
    };

    assertStoreValues(resources);
    return Effect.succeed({ resources });
  };

  const hydrate = (hydrateStore: ResourcesHydrate) => {
    assertStoreValues(hydrateStore.resources);

    health.value = hydrateStore.resources.health ?? health.value;
    spirit.value = hydrateStore.resources.spirit ?? spirit.value;
    supply.value = hydrateStore.resources.supply ?? supply.value;
    xp.value = hydrateStore.resources.xp ?? xp.value;
    spentXp.value = hydrateStore.resources.spentXp ?? spentXp.value;
    momentum.value = hydrateStore.resources.momentum ?? momentum.value;
  };

  return {
    health,
    spirit,
    supply,
    xp,
    spentXp,
    momentum,
    momentumMax,
    momentumReset,
    dehydrate,
    hydrate,
  };
});

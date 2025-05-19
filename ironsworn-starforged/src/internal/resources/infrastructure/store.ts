import { defineStore } from 'pinia';
import { ref } from 'vue';
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
  assert(values.xp >= 0, `values.xp: ${values.xp}`);
  assert(values.spentXp >= 0, `values.spentXp: ${values.spentXp}`);
};

export const useResourcesStore = defineStore('resources', () => {
  const health = ref(5);
  const spirit = ref(5);
  const supply = ref(5);
  const xp = ref(0);
  const spentXp = ref(0);

  const dehydrate = () => {
    const resources = {
      health: health.value,
      spirit: spirit.value,
      supply: supply.value,
      xp: xp.value,
      spentXp: spentXp.value,
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
  };

  return {
    health,
    spirit,
    supply,
    xp,
    spentXp,
    dehydrate,
    hydrate,
  };
});

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';

export type ResourcesHydrate = {
  resources: {
    health: number;
    spirit: number;
    supply: number;
    xp: number;
    spentXp: number;
    momentum: number;
    momentumMax: number;
    momentumReset: number;
  };
};

export const useResourcesStore = defineStore('resources', () => {
  const impacts = useImpactsStore();

  const health = ref(5);
  const spirit = ref(5);
  const supply = ref(5);
  const xp = ref(0);
  const spentXp = ref(0);
  const momentum = ref(2);
  const momentumMax = computed(() => (impacts.list.length > 10 ? 0 : 10 - impacts.list.length));
  const momentumReset = computed(() =>
    impacts.list.length === 1 ? 1 : impacts.list.length >= 2 ? 0 : 2,
  );

  const dehydrate = () => {
    return {
      resources: {
        health: health.value,
        spirit: spirit.value,
        supply: supply.value,
        xp: xp.value,
        spentXp: spentXp.value,
        momentum: momentum.value,
      },
    };
  };

  const hydrate = (hydrateStore: ResourcesHydrate) => {
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

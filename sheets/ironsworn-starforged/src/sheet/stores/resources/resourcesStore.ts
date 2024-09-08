import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ResourcesHydrate = {
  resources: {
    health: number;
    spirit: number;
    supply: number;
    xp: number;
  };
};

export const useResourcesStore = defineStore('resources', () => {
  const health = ref(0);
  const spirit = ref(0);
  const supply = ref(0);
  const xp = ref(0);

  const dehydrate = () => {
    return { 
      resources: {
        health: health.value,
        spirit: spirit.value,
        supply: supply.value,
        xp: xp.value,
      }
     };
  };

  const hydrate = (hydrateStore: ResourcesHydrate) => {
    health.value = hydrateStore.resources.health ?? health.value;
    spirit.value = hydrateStore.resources.spirit ?? spirit.value;
    supply.value = hydrateStore.resources.supply ?? supply.value;
    xp.value = hydrateStore.resources.xp ?? xp.value;
  };

  return {
    health,
    spirit,
    supply,
    xp,
    dehydrate,
    hydrate,
  };
});

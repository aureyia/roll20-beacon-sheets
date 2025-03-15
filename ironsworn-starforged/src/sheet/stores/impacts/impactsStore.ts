import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { createId } from '@paralleldrive/cuid2';
import { arrayToObject, objectToArray } from '@/utility/objectify';
import type {
  AnyImpact,
  Burden,
  CurrentVehicle,
  LastingEffect,
  Misfortune,
  Other,
} from '@/system/impacts';
import { Effect } from 'effect';

export type ImpactsHydrate = {
  impacts: {
    misfortunes: Misfortune[];
    lastingEffects: LastingEffect[];
    burdens: Burden[];
    currentVehicle: CurrentVehicle[];
    other: Other[];
  };
};

export const useImpactsStore = defineStore('impacts', () => {
  const misfortunes: Ref<Array<Misfortune>> = ref([]);
  const lastingEffects: Ref<Array<LastingEffect>> = ref([]);
  const burdens: Ref<Array<Burden>> = ref([]);
  const currentVehicle: Ref<Array<CurrentVehicle>> = ref([]);
  const other: Ref<Array<Other>> = ref([]);

  const addImpact = (
    name: AnyImpact['name'],
    category: AnyImpact['category'],
    description?: string,
  ) => {
    if (!category) {
      throw new Error('Category is required when adding an impact');
    }
    if (!name) {
      throw new Error('Option is required when adding an impact');
    }
    const impact: AnyImpact = {
      _id: createId(),
      category: category,
      name: name,
      description: description || '',
    };
    if (
      ![
        'misfortunes',
        'lastingEffects',
        'burdens',
        'currentVehicle',
        'other',
      ].includes(category)
    ) {
      throw new Error(`Unknown category: ${category}`);
    }

    switch (category) {
      case 'misfortunes':
        misfortunes.value.push(impact as Misfortune);
        break;
      case 'lastingEffects':
        lastingEffects.value.push(impact as LastingEffect);
        break;
      case 'burdens':
        burdens.value.push(impact as Burden);
        break;
      case 'currentVehicle':
        currentVehicle.value.push(impact as CurrentVehicle);
        break;
      case 'other':
        other.value.push(impact as Other);
        break;
    }
  };

  const removeImpact = (impact: AnyImpact) => {
    if (!impact.category) {
      throw new Error('Category is required when removing an impact');
    }
    if (!impact._id) {
      throw new Error('_id is required when removing an impact');
    }
    if (
      ![
        'misfortunes',
        'lastingEffects',
        'burdens',
        'currentVehicle',
        'other',
      ].includes(impact.category)
    ) {
      throw new Error(`Unknown category: ${impact.category}`);
    }

    switch (impact.category) {
      case 'misfortunes':
        misfortunes.value = misfortunes.value.filter(
          (entry) => entry.name !== impact.name,
        );
        lastingEffects.value = lastingEffects.value.filter(
          (entry) => entry.name !== impact.name,
        );
        break;
      case 'burdens':
        burdens.value = burdens.value.filter(
          (entry) => entry.name !== impact.name,
        );
        break;
      case 'currentVehicle':
        currentVehicle.value = currentVehicle.value.filter(
          (entry) => entry.name !== impact.name,
        );
        break;
      case 'other':
        other.value = other.value.filter((entry) => entry.name !== impact.name);
        break;
    }
  };

  const clearImpacts = () => {
    misfortunes.value = [];
    lastingEffects.value = [];
    burdens.value = [];
    currentVehicle.value = [];
    other.value = [];
  };

  const dehydrate = () => {
    return Effect.succeed({
      impacts: {
        misfortunes: Effect.runSync(arrayToObject(misfortunes.value)),
        lastingEffects: Effect.runSync(arrayToObject(lastingEffects.value)),
        burdens: Effect.runSync(arrayToObject(burdens.value)),
        currentVehicle: Effect.runSync(arrayToObject(currentVehicle.value)),
        other: Effect.runSync(arrayToObject(other.value)),
      },
    });
  };

  const hydrate = (hydrateStore: ImpactsHydrate) => {
    misfortunes.value =
      Effect.runSync(objectToArray(hydrateStore.impacts.misfortunes)) ??
      misfortunes.value;
    lastingEffects.value =
      Effect.runSync(objectToArray(hydrateStore.impacts.lastingEffects)) ??
      lastingEffects.value;
    burdens.value =
      Effect.runSync(objectToArray(hydrateStore.impacts.burdens)) ??
      burdens.value;
    currentVehicle.value =
      Effect.runSync(objectToArray(hydrateStore.impacts.currentVehicle)) ??
      currentVehicle.value;
    other.value =
      Effect.runSync(objectToArray(hydrateStore.impacts.other)) ?? other.value;
  };

  const list = computed(() => {
    return [
      ...misfortunes.value,
      ...lastingEffects.value,
      ...burdens.value,
      ...currentVehicle.value,
      ...other.value,
    ];
  });

  return {
    list,
    misfortunes,
    lastingEffects,
    burdens,
    currentVehicle,
    other,
    addImpact,
    removeImpact,
    clearImpacts,
    dehydrate,
    hydrate,
  };
});

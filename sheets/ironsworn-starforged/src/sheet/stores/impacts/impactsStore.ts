import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { arrayToObject, objectToArray } from '@/utility/objectify';

export type Impact = {
  _id: string
  category: 'misfortunes' | 'lastingEffects' | 'burdens' | 'currentVehicle' | 'other'
}

export type Misfortune = Impact & {
  type: 'wounded' | 'shaken' | 'unprepared';
}
export type LastingEffect = Impact & {
  type: 'permanently harmed' | 'traumatized'
}
export type Burden = Impact & {
  type: 'doomed' | 'tormented' | 'indebted'
}
export type CurrentVehicle = Impact & {
  type: 'battered' | 'cursed'
}

export type Other = Impact & {
  type: string
}

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

  const dehydrate = () => {
    return {
      impacts: {
        misfortunes: arrayToObject(misfortunes.value),
        lastingEffects: arrayToObject(lastingEffects.value),
        burdens: arrayToObject(burdens.value),
        currentVehicle: arrayToObject(currentVehicle.value),
        other: arrayToObject(other.value),
      },
    };
  };

  const list = computed(() => {
    return [
      ...misfortunes.value,
      ...lastingEffects.value,
      ...burdens.value,
      ...currentVehicle.value,
      ...other.value
    ]
  })

  const hydrate = (hydrateStore: ImpactsHydrate) => {
    misfortunes.value = objectToArray(hydrateStore.impacts.misfortunes) ?? misfortunes.value;
    lastingEffects.value = objectToArray(hydrateStore.impacts.lastingEffects) ?? lastingEffects.value;
    burdens.value = objectToArray(hydrateStore.impacts.burdens) ?? burdens.value;
    currentVehicle.value = objectToArray(hydrateStore.impacts.currentVehicle) ?? currentVehicle.value;
    other.value = objectToArray(hydrateStore.impacts.other) ?? other.value;
  };

  return {
    list,
    misfortunes,
    lastingEffects,
    burdens,
    currentVehicle,
    other,
    dehydrate,
    hydrate,
  };
});
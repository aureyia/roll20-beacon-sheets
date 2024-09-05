import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { arrayToObject, objectToArray } from '@/utility/objectify';

export type Impact = {
  _id: string
  category: 'misfortunes' | 'lastingEffects' | 'burdens' | 'currentVehicle' | 'other'
  description?: string
}

export type Misfortune = Impact & {
  name: 'wounded' | 'shaken' | 'unprepared';
}
export type LastingEffect = Impact & {
  name: 'permanently harmed' | 'traumatized'
}
export type Burden = Impact & {
  name: 'doomed' | 'tormented' | 'indebted'
}
export type CurrentVehicle = Impact & {
  name: 'battered' | 'cursed'
}

export type Other = Impact & {
  name: string
}

export type AnyImpact = Misfortune | LastingEffect | Burden | CurrentVehicle | Other

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

  const addImpact = (name :AnyImpact['name'], category: AnyImpact['category'], description?: string) => {
    if (!category) {
      throw new Error('Category is required when adding an impact')
    }
    if (!name) {
      throw new Error('Option is required when adding an impact')
    }
    const impact :AnyImpact = {
      _id: uuidv4(),
      category: category,
      name: name,
      description: description || ''
    }
    if (!['misfortunes', 'lastingEffects', 'burdens', 'currentVehicle', 'other'].includes(category)) {
      throw new Error(`Unknown category: ${category}`)
    }

    switch (category) {
      case 'misfortunes':
        misfortunes.value.push(impact as Misfortune)
        break
      case 'lastingEffects':
        lastingEffects.value.push(impact as LastingEffect)
        break
      case 'burdens':
        burdens.value.push(impact as Burden)
        break
      case 'currentVehicle':
        currentVehicle.value.push(impact as CurrentVehicle)
        break
      case 'other':
        other.value.push(impact as Other)
        break
    }
  }

  const removeImpact = (name :AnyImpact['name'], category: AnyImpact['category']) => {
    if (!category) {
      throw new Error('Category is required when adding an impact')
    }
    if (!name) {
      throw new Error('Option is required when adding an impact')
    }
    if (!['misfortunes', 'lastingEffects', 'burdens', 'currentVehicle', 'other'].includes(category)) {
      throw new Error(`Unknown category: ${category}`)
    }

    switch (category) {
      case 'misfortunes':
        misfortunes.value = misfortunes.value.filter(entry => entry.name !== name)
        break
      case 'lastingEffects':
        lastingEffects.value = lastingEffects.value.filter(entry => entry.name !== name)
        break
      case 'burdens':
        burdens.value = burdens.value.filter(entry => entry.name !== name)
        break
      case 'currentVehicle':
        currentVehicle.value = currentVehicle.value.filter(entry => entry.name !== name)
        break
      case 'other':
        other.value = other.value.filter(entry => entry.name !== name)
        break
    }
  }

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

  const hydrate = (hydrateStore: ImpactsHydrate) => {
    misfortunes.value = objectToArray(hydrateStore.impacts.misfortunes) ?? misfortunes.value;
    lastingEffects.value = objectToArray(hydrateStore.impacts.lastingEffects) ?? lastingEffects.value;
    burdens.value = objectToArray(hydrateStore.impacts.burdens) ?? burdens.value;
    currentVehicle.value = objectToArray(hydrateStore.impacts.currentVehicle) ?? currentVehicle.value;
    other.value = objectToArray(hydrateStore.impacts.other) ?? other.value;
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

  return {
    list,
    misfortunes,
    lastingEffects,
    burdens,
    currentVehicle,
    other,
    addImpact,
    removeImpact,
    dehydrate,
    hydrate,
  };
});
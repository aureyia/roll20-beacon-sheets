import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { createId } from '@paralleldrive/cuid2'
import { arrayToObject, objectToArray } from '@/utility/objectify';

export type Difficulty = 'troublesome' | 'dangerous' | 'formidable' | 'extreme' | 'epic'

export type Progress = {
  _id: string
  description: string
  type: 'vow' | 'generic'
  value: number
  difficulty: Difficulty
  completed: boolean
}

export type Challenge = Progress & {
  type: 'challenge'
  coundown: 0 | 1 | 2 | 3 | 4
}


export const useProgressStore = defineStore('progress', () => {

  const chronicle: Ref<Array<ChronicleEntry>> = ref([]);

  const addChronicleEntry = (submisson: ChronicleEntrySubmission) => {
    chronicle.value.push({
      _id: createId(),
      date: new Date(),
      ...submisson
    })
  }

  const removeChronicleEntry = (id: string) => {
    chronicle.value =chronicle.value.filter(entry => entry._id !== id)
  }

  const dehydrate = () => {
    return {
      chronicle: arrayToObject(chronicle.value)
    };
  };

  const hydrate = (hydrateStore: chronicleHydrate) => {
    chronicle.value = objectToArray(hydrateStore.chronicle) ?? chronicle.value
  };

  return {
    chronicle,
    addChronicleEntry,
    removeChronicleEntry,
    dehydrate,
    hydrate,
  };
});
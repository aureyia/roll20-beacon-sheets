import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { arrayToObject, objectToArray } from '@/utility/objectify';

export type ChronicleEntrySubmission = {
    title: string
    subtitle?: string
    body: string
    tags?: string[]
    locations?: string[] // TODO:Turn into location type in future
    connections?: string[] // TODO:Turn into connection type in future
}

export type ChronicleEntry = ChronicleEntrySubmission & {
  _id: string
  date: Date
}

export type chronicleHydrate = ChronicleEntry & {
  chronicle: ChronicleEntry[]
};

export const useChronicleStore = defineStore('chronicle', () => {

  const chronicle: Ref<Array<ChronicleEntry>> = ref([]);

  const addChronicleEntry = (submisson: ChronicleEntrySubmission) => {
    chronicle.value.push({
      _id: uuidv4(),
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
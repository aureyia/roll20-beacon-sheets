import { Effect } from 'effect';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type CharacterHydrate = {
  character: {
    callsign: string;
    pronouns: string;
  };
};

export const useCharacterStore = defineStore('character', () => {
  const callsign = ref('');
  const pronouns = ref('');

  const dehydrate = () => {
    return Effect.succeed({
      character: {
        callsign: callsign.value,
        pronouns: pronouns.value,
      },
    });
  };

  const hydrate = (hydrateStore: CharacterHydrate) => {
    callsign.value = hydrateStore.character.callsign ?? callsign.value;
    pronouns.value = hydrateStore.character.pronouns ?? pronouns.value;
  };

  return {
    callsign,
    pronouns,
    dehydrate,
    hydrate,
  };
});

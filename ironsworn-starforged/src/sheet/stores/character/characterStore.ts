import { assert } from '@/utility/assert';
import { Effect } from 'effect';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type CharacterHydrate = {
  character: {
    callsign: string;
    pronouns: string;
  };
};

const assertStoreValues = (values: any) => {
  assert(typeof values.callsign === 'string', `invalid callsign type: ${values.callsign}`);
  assert(typeof values.pronouns === 'string', `invalid pronouns type: ${values.pronouns}`);
};

export const useCharacterStore = defineStore('character', () => {
  const callsign = ref('');
  const pronouns = ref('');

  const dehydrate = () => {
    const character = {
      callsign: callsign.value,
      pronouns: pronouns.value,
    };

    assertStoreValues(character);
    return Effect.succeed({ character });
  };

  const hydrate = (hydrateStore: CharacterHydrate) => {
    assertStoreValues(hydrateStore.character);

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

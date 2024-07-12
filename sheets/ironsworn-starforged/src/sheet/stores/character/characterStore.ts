import { defineStore } from 'pinia';
import { ref } from 'vue';

export type CharacterHydrate = {
  character: {
    callsign: string;
    pronouns: string;
    health: number;
    spirit: number;
    supply: number;
    currentXp: number;
    spentXp: number;
  };
};

export const useCharacterStore = defineStore('character', () => {
  const callsign = ref('')
  const pronouns = ref('')
  const health = ref(5);
  const spirit = ref(5);
  const supply = ref(5);
  const currentXp = ref(0);
  const spentXp = ref(0);

  const dehydrate = () => {
    return {
      character: {
        callsign: callsign.value,
        pronouns: pronouns.value,
        health: health.value,
        spirit: spirit.value,
        supply: supply.value,
        currentXp: currentXp.value,
        spentXp: spentXp.value,
      },
    };
  };

  const hydrate = (hydrateStore: CharacterHydrate) => {
    callsign.value = hydrateStore.character.callsign ?? callsign.value;
    pronouns.value = hydrateStore.character.pronouns ?? pronouns.value;
    health.value = hydrateStore.character.health ?? health.value;
    spirit.value = hydrateStore.character.spirit ?? spirit.value;
    supply.value = hydrateStore.character.supply ?? supply.value;
    currentXp.value = hydrateStore.character.currentXp ?? currentXp.value;
    spentXp.value = hydrateStore.character.spentXp ?? spentXp.value;
  };

  return {
    callsign,
    pronouns,
    health,
    spirit,
    supply,
    currentXp,
    spentXp,
    dehydrate,
    hydrate,
  };
});
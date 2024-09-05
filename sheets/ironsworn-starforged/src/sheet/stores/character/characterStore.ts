import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';

export type CharacterHydrate = {
  character: {
    name: string;
    callsign: string;
    pronouns: string;
    health: number;
    spirit: number;
    supply: number;
    currentXp: number;
    spentXp: number;
    momentum: number;
    momentumMax: number;
    momentumReset: number;
  };
};

export const useCharacterStore = defineStore('character', () => {
  const impacts = useImpactsStore()

  const name = ref('')
  const callsign = ref('')
  const pronouns = ref('')
  const health = ref(5);
  const spirit = ref(5);
  const supply = ref(5);
  const currentXp = ref(0);
  const spentXp = ref(0);
  const momentum = ref(2)
  const momentumMax = computed(() => impacts.list.length > 10 ? 0 : 10 - impacts.list.length)
  const momentumReset = computed(() => 
    impacts.list.length === 1 ? 1 : (impacts.list.length >= 2 ? 0 : 2)
  );

  const dehydrate = () => {
    return {
      character: {
        name: name.value,
        callsign: callsign.value,
        pronouns: pronouns.value,
        health: health.value,
        spirit: spirit.value,
        supply: supply.value,
        currentXp: currentXp.value,
        spentXp: spentXp.value,
        momentum: momentum.value
      },
    };                                          
  };

  const hydrate = (hydrateStore: CharacterHydrate) => {
    name.value = hydrateStore.character.name ?? name.value;
    callsign.value = hydrateStore.character.callsign ?? callsign.value;
    pronouns.value = hydrateStore.character.pronouns ?? pronouns.value;
    health.value = hydrateStore.character.health ?? health.value;
    spirit.value = hydrateStore.character.spirit ?? spirit.value;
    supply.value = hydrateStore.character.supply ?? supply.value;
    currentXp.value = hydrateStore.character.currentXp ?? currentXp.value;
    spentXp.value = hydrateStore.character.spentXp ?? spentXp.value;
    momentum.value = hydrateStore.character.momentum ?? momentum.value;
  };

  return {
    name,
    callsign,
    pronouns,
    health,
    spirit,
    supply,
    currentXp,
    spentXp,
    momentum,
    momentumMax,
    momentumReset,
    dehydrate,
    hydrate,
  };
});
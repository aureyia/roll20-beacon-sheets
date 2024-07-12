import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Type for All the Data coming from Firebase to hydrate this store.
export type StatsHydrate = {
  stats: {
    Edge: number;
    Heart: number;
    Iron: number;
    Shadow: number;
    Wits: number;
  };
};

export type Stat = 'Edge' | 'Heart' | 'Iron' | 'Shadow' | 'Wits';

export const useStatsStore = defineStore('stats', () => {
  // Initialize Current Ability scores
  const Edge = ref(0);
  const Heart = ref(0);
  const Iron = ref(0);
  const Shadow = ref(0);
  const Wits = ref(0);

  // It can be very convenient to make a Getter/Setter computed prop like this to read/write data into store.
  // This will just read/write into the previously defined ability score fields.
  const stats = computed({
    get() {
      return {
        Edge: Edge.value,
        Heart: Heart.value,
        Iron: Iron.value,
        Shadow: Shadow.value,
        Wits: Wits.value,
      };
    },
    set(stats) {
      Edge.value = stats.Edge || Edge.value;
      Heart.value = stats.Heart || Heart.value;
      Iron.value = stats.Iron || Iron.value;
      Shadow.value = stats.Shadow || Shadow.value;
      Wits.value = stats.Wits || Wits.value;
    },
  });
  // Example for how to make basic roll + some modifiers using a custom roll template.
  // const rollAbilityCheck = async (abilityScore: AbilityScore, proficient: boolean = false) => {
  //   const score = abilityScores.value[abilityScore].current;
  //   const { level } = useCharacterStore();

  //   // @ts-ignore
  //   const profBonus = proficient ? levelTable[level].profBonus || 0 : 0; // Dynamically determined based on Level.

  //   // Base components in any ability roll.
  //   const components = [
  //     { label: `Base Roll`, sides: 20 },
  //     { label: 'Stat Mod', value: score },
  //     { label: 'Proficiency', value: profBonus },
  //   ];
  //   // Example of modifying the roll based on some rule.
  //   // In this case: if overburdened, apply a penalty based on the "encumbrancePenalty" setting.
  //   const { isOverburdened } = useInventoryStore();
  //   if (isOverburdened) {
  //     const encumbrancePenalty = useSettingsStore().encumbrancePenalty;
  //     components.push({ label: 'Overencumbered', value: encumbrancePenalty });
  //   }
  //   await rollToChat({
  //     title: `${abilityScore}`,
  //     subtitle: 'Ability Check',
  //     traits: ['Ability', 'Basic'],
  //     allowHeroDie: true,
  //     components,
  //   });
  // };

  // Dehydrate determines how fields in Firebase are updated when there's a change in this store.
  // Everything that needs to be saved to Firebase should be defined here.
  const dehydrate = () => {
    // We save our entire object with the base/current scores.
    return { stats: stats.value };
  };

  // Hydrate determines how the store is updated when we receive updates from Firebase
  const hydrate = (hydrateStore: StatsHydrate) => {
    stats.value = hydrateStore.stats;
  };

  return {
    stats,
    dehydrate,
    hydrate,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type SettingsHydrate = {
  settings: {
    mode: 'character-standard' | 'character-edge' | 'guide' | 'locations' | 'orcales' | 'shared' | 'ship';
  };
};

export const useSettingsStore = defineStore('settings', () => {
  const mode = ref('');

  const setMode = (arg :string) => mode.value = arg
  const clearMode = () => mode.value = ''

  const dehydrate = () => {
    return {
      settings: {
        mode: mode.value,
      },
    };
  };

  const hydrate = (hydrateStore: SettingsHydrate) => {
    mode.value = hydrateStore.settings.mode ?? mode.value;
  };

  return {
    mode,
    setMode,
    clearMode,
    dehydrate,
    hydrate,
  };
});

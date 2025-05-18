import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Effect } from 'effect';

export type SettingsHydrate = {
  settings: {
    mode:
      | 'character-standard'
      | 'character-edge'
      | 'guide'
      | 'locations'
      | 'orcales'
      | 'shared'
      | 'ship';
    darkMode: 'dark' | 'light' | 'auto' | 'unset';
  };
};

export const useSettingsStore = defineStore('settings', () => {
  const mode = ref('');
  const darkMode = ref('unset');

  const setMode = (arg: string) => (mode.value = arg);
  const clearMode = () => (mode.value = '');

  const dehydrate = () => {
    return Effect.succeed({
      settings: {
        mode: mode.value,
        darkMode: darkMode.value,
      },
    });
  };

  const hydrate = (hydrateStore: SettingsHydrate) => {
    mode.value = hydrateStore.settings.mode ?? mode.value;
    darkMode.value = hydrateStore.settings.darkMode ?? darkMode.value;
  };

  return {
    mode,
    darkMode,
    setMode,
    clearMode,
    dehydrate,
    hydrate,
  };
});

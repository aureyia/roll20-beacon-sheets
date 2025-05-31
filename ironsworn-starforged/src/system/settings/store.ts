import { createStore } from '@xstate/store';
import { sync } from '@/external/sync';

type DarkMode = 'dark' | 'light' | 'auto' | 'unset';
type SheetMode =
  | 'character-standard'
  | 'character-edge'
  | 'guide'
  | 'locations'
  | 'mode-select'
  | 'orcales'
  | 'shared'
  | 'ship';

export type Settings = {
  mode: SheetMode;
  darkMode: DarkMode;
};

export const settingsStore = createStore({
  context: {
    mode: 'mode-select',
    darkMode: 'unset',
  },
  on: {
    hydrate: (context, event: Settings) => {
      context.mode = event.mode;
      context.darkMode = event.darkMode;
    },
    set: (
      context,
      event: { label: keyof Settings; value: SheetMode | DarkMode },
    ) => {
      context[event.label] = event.value;
      sync.send({ type: 'update' });
    },
  },
});

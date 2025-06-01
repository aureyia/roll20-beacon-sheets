import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';
import type { SetEvent } from '@/utility/store-types';

type SettingsSetEvent = SetEvent<Settings>;

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
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context, event: Settings) => {
      context.mode = event.mode ?? context.mode;
      context.darkMode = event.darkMode ?? context.darkMode;
    },
    set: (context, event: SettingsSetEvent, enqueue) => {
      context[event.label] = event.value;
      enqueue.emit.updated();
    },
  },
});

export class DehydrateSettings extends Context.Tag('DehydrateSettings')<
  DehydrateSettings,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateSettingsLive = Layer.effect(
  DehydrateSettings,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = settingsStore.get().context;
          return {
            mode: context.mode,
            darkMode: context.darkMode,
          };
        }),
    };
  }),
);

import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';

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
      context.mode = event.mode ?? context.mode;
      context.darkMode = event.darkMode ?? context.darkMode;
    },
    set: (
      context,
      event: { label: keyof Settings; value: SheetMode | DarkMode },
    ) => {
      context[event.label] = event.value;
    },
  },
});

// export const syncUpdate = () => {
//   sync.send({ type: 'update' });
// };

export class DehydrateSettings extends Context.Tag('DehydrateSettings')<
  DehydrateSettings,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateSettingsLive =
  Layer.effect(
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

import { useSettingsStore } from './settingsStore';
import { createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';

describe('settingsStore', () => {
  const mode = 'character-standard';
  const pinia = createPinia();
  const store = useSettingsStore(pinia);

  it('defaults correct values', () => {
    expect(store).toBeTruthy();

    expect(store.dehydrate()).toEqual({
      settings: {
        mode: mode,
      },
    });
  });

  it('updates encumbrance penalty', () => {
    const newEncumbrancePenalty = -1;

    expect(
      store.hydrate({
        settings: {
          mode: mode,
        },
      }),
    );

    expect(store.dehydrate()).toEqual({
      settings: {
        encumbrancePenalty: mode,
      },
    });
  });
});

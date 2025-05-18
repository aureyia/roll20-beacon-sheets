import { useResourcesStore } from './store';
import { createPinia } from 'pinia';
import { describe, test, expect } from 'vitest';
import { Effect } from 'effect';
import { boundsData } from './fixtures/bounds';

describe('resourcesStore', () => {
  const pinia = createPinia();
  const store = useResourcesStore(pinia);

  test('defaults correct values', () => {
    expect(store).toBeTruthy();

    expect(Effect.runSync(store.dehydrate())).toEqual({
      resources: {
        health: 5,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: 0,
      },
    });
  });

  test('correctly update all values', () => {
    const values = {
      resources: {
        health: 4,
        spirit: 4,
        supply: 4,
        xp: 1,
        spentXp: 1,
      },
    };

    expect(store.hydrate(values));
    expect(Effect.runSync(store.dehydrate())).toEqual(values);
  });

  boundsData.forEach(({ fixture, error }) => {
    test('Assert fails for each upper bound', () => {
      expect(() => store.hydrate(fixture)).toThrowError(error);
    });
  });
});

import { Effect, Context, Layer } from 'effect';

import { metaStore } from '../meta.store';
import { momentumStore } from '@/system/momentum/store.x';

const stores = {
  meta: metaStore,
  momentum: momentumStore,
};

export class Hydration extends Context.Tag('Dehydration')<
  Hydration,
  {
    readonly hydrateStores: (context: any) => Effect.Effect<void>;
  }
>() {}

export const HydrationLive = Layer.effect(
  Hydration,
  Effect.gen(function* () {
    return {
      hydrateStores: (context) =>
        Effect.gen(function* () {
          const storeKeys = Object.keys(stores) as (keyof typeof stores)[];
          storeKeys.forEach((key) => {
            stores[key].send({ type: 'hydrate', context })
          });
        }),
    };
  }),
);

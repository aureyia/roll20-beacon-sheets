import { Effect, Context, Layer } from 'effect';

import { metaStore as meta } from '@/external/store';
import { characterStore as character } from '@/system/character/store.x';
import { assetsStore as assets } from '@/system/assets/store';
import { statsStore as stats } from '@/system/stats/store.x';
import { resourcesStore as resources } from '@/system/resources/store.x';
import { momentumStore as momentum } from '@/system/momentum/store';
import { impactsStore as impacts } from '@/system/impacts/store';
import { settingsStore as settings } from '@/system/settings/store.x';
import { tasksStore as tasks } from '@/system/tasks/store.x';

const stores = {
  meta,
  character,
  assets,
  stats,
  resources,
  momentum,
  impacts,
  settings,
  tasks,
};

export class Hydration extends Context.Tag('Dehydration')<
  Hydration,
  {
    readonly hydrateStores: (context: any) => void;
  }
>() {}

export const HydrationLive = Layer.effect(
  Hydration,
  Effect.gen(function* () {
    return {
      hydrateStores: (context) => {
        const storeKeys = Object.keys(stores) as (keyof typeof stores)[];
        storeKeys.forEach((key) => {
          stores[key].send({ type: 'hydrate', context });
        });
      },
    };
  }),
);

import { Effect, Context, Layer } from 'effect';

import { DehydrateMeta } from '@/external/store';
import { DehydrateCharacter } from '@/system/character/store';
import { DehydrateAssets } from '@/system/assets/store';
import { DehydrateStats } from '@/system/stats/store';
import { DehydrateResources } from '@/system/resources/store';
import { DehydrateMomentum } from '@/system/momentum/store';
import { DehydrateImpacts } from '@/system/impacts/store';
import { DehydrateSettings } from '@/system/settings/store';
import { DehydrateTasks } from '@/system/tasks/store';

export class Dehydration extends Context.Tag('Dehydration')<
  Dehydration,
  {
    dehydrateStores: () => Effect.Effect<Record<string, any>, Error>;
  }
>() {}

export const DehydrationLive = Layer.effect(
  Dehydration,
  // @ts-ignore
  Effect.gen(function* () {
    const stores = {
      meta: yield* DehydrateMeta,
      character: yield* DehydrateCharacter,
      assets: yield* DehydrateAssets,
      stats: yield* DehydrateStats,
      resources: yield* DehydrateResources,
      momentum: yield* DehydrateMomentum,
      impacts: yield* DehydrateImpacts,
      settings: yield* DehydrateSettings,
      tasks: yield* DehydrateTasks,
    };

    return {
      dehydrateStores: () =>
        Effect.gen(function* () {
          const character: Record<string, any> = {};
          character.attributes = {};
          const storeKeys = Object.keys(stores) as (keyof typeof stores)[];

          for (const key of storeKeys) {
            if (key === 'meta') {
              const { name, bio, gmNotes, avatar } = stores.meta.dehydrate;

              character.name = name;
              character.bio = bio;
              character.gmNotes = gmNotes;
              character.avatar = avatar;
            } else {
              character.attributes[key] = yield* stores[key].dehydrate();
            }
          }

          return character;
        }),
    };
  }),
);

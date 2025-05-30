import { Effect, Context, Layer } from 'effect';

import { dehydrate as meta } from '@/external/store.x';
import { dehydrate as character } from '@/system/character/store.x';
import { dehydrate as assets } from '@/system/assets/store.x';
import { dehydrate as stats } from '@/system/stats/store.x';
import { dehydrate as resources } from '@/system/resources/store.x';
import { dehydrate as momentum } from '@/system/momentum/store.x';
import { dehydrate as impacts } from '@/system/impacts/store.x';
import { dehydrate as settings } from '@/system/settings/store.x';
import { dehydrate as tasks } from '@/system/tasks/store.x';

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

export class Dehydration extends Context.Tag('Dehydration')<
  Dehydration,
  {
    readonly dehydrateStores: () => Effect.Effect<Record<string, any>>;
  }
>() {}

export const DehydrationLive = Layer.effect(
  Dehydration,

  Effect.gen(function* () {
    return {
      dehydrateStores: () =>
        Effect.gen(function* () {
          const character: Record<string, any> = {};
          character.attributes = {};
          const storeKeys = Object.keys(stores) as (keyof typeof stores)[];
          storeKeys.forEach((key) => {
            if (key === 'meta') {
              const { name, bio, gmNotes, avatar } = stores.meta();
              
              character.name = name;
              character.bio = bio;
              character.gmNotes = gmNotes;
              character.avatar = avatar;
            } else {
              character.attributes[key] = stores[key]()
            }
          });

          return character;
        }),
    };
  }),
);

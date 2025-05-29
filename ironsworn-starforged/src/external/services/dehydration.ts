import { Effect, Context, Layer } from 'effect';

import { dehydrate as meta } from '../meta.store';
import { dehydrate as momentum } from '@/system/momentum/store.x';

const stores = {
  meta,
  momentum,
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

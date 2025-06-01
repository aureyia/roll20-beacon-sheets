import { objectToArray, arrayToObject } from '@/utility/objectify';
import { createId } from '@paralleldrive/cuid2';
import { Context, Effect, Layer } from 'effect';
import type { Ability, AssetCategory, Asset } from '@/system/assets/types';
import { getAssetAbilities } from '@/system/assets/asset';
import { createStore } from '@xstate/store';

export type AssetsHydrate = {
  assets: Asset[];
};

export type AssetSubmission = {
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  meter: number | null;
};

const formatAbilities = (
  formatter: typeof objectToArray | typeof arrayToObject,
  assets: AssetsHydrate | any,
) => {
  if (!assets) {
    return Effect.fail(new Error('No assets were provided'));
  }

  const mappedAssets = assets.map((asset: any) => {
    const abilities = Effect.runSync(formatter(asset.abilities));
    return {
      ...asset,
      abilities: abilities,
    };
  });

  return Effect.succeed(mappedAssets);
};

export const assetsStore = createStore({
  context: {
    list: [] as Asset[],
  },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context: any, event: Asset[]) => {
      const assetList = Effect.runSync(objectToArray(event));
      const updatedAssets = Effect.runSync(
        formatAbilities(objectToArray, assetList),
      );

      context.assets = updatedAssets ?? context.assets;
    },
    add: (context: any, event: AssetSubmission, enqueue) => {
      const abilities: Ability[] = Effect.runSync(
        getAssetAbilities(event.dataforgedId, event.category),
      );

      context.list.push({
        _id: createId(),
        dataforgedId: event.dataforgedId,
        name: event.name,
        category: event.category,
        abilities,
        meter: event.meter,
      });

      enqueue.emit.updated();
    },
    remove: (context, id: string, enqueue) => {
      context.list = context.list.filter((asset: Asset) => asset._id !== id);
      enqueue.emit.updated();
    },
    clear: (context, event, enqueue) => {
      context.list = [];
      enqueue.emit.updated();
    },
  },
});

export class DehydrateAssets extends Context.Tag('DehydrateAssets')<
  DehydrateAssets,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, Error>;
  }
>() {}

export const DehydrateAssetsLive = Layer.effect(
  DehydrateAssets,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = assetsStore.get().context.list as Asset[];
          const updatedAssets = yield* formatAbilities(arrayToObject, context);
          return yield* arrayToObject(updatedAssets);
        }),
    };
  }),
);

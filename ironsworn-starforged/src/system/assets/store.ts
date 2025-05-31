import { objectToArray, arrayToObject } from '@/utility/objectify';
import { createId } from '@paralleldrive/cuid2';
import { Effect } from 'effect';
import type { Ability, AssetCategory, Asset } from '@/system/assets/types';
import { getAssetAbilities } from '@/system/assets/assets';
import { createStore } from '@xstate/store';
import { sync } from '@/external/sync';

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
    assets: [],
  },
  on: {
    hydrate: (context: any, event: Asset[]) =>
      Effect.gen(function* () {
        const assetList = yield* objectToArray(event);
        const updatedAssets = yield* formatAbilities(objectToArray, assetList);

        context.assets = updatedAssets;
      }),
    add: (context: any, event: AssetSubmission) =>
      Effect.gen(function* () {
        const abilities: Ability[] = yield* getAssetAbilities(
          event.dataforgedId,
          event.category,
        );

        context.assets.push({
          _id: createId(),
          dataforgedId: event.dataforgedId,
          name: event.name,
          category: event.category,
          abilities,
          meter: event.meter,
        });

        sync.send({ type: 'update' });
      }),
  },
});

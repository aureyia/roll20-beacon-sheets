import { objectToArray, arrayToObject } from '@/utility/objectify';
import { createId } from '@paralleldrive/cuid2';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { Effect } from 'effect';
import type { Ability, AssetCategory, Asset } from './types/asset-types';
import { getAssetAbilities } from './helpers/assets';

export type AssetsHydrate = {
  assets: Asset[];
};

export type AssetSubmission = {
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  meter?: number;
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

export const useAssetStore = defineStore('asset', () => {
  const assets: Ref<Array<Asset>> = ref([]);

  const addAsset = (opts: AssetSubmission) => {
    const abilities: Ability[] = Effect.runSync(
      getAssetAbilities(opts.dataforgedId, opts.category),
    );
    assets.value.push({
      _id: createId(),
      dataforgedId: opts.dataforgedId,
      name: opts.name,
      category: opts.category,
      abilities,
      meter: opts.meter,
    });
  };

  const dehydrate = () => {
    const updatedAssets = Effect.runSync(formatAbilities(arrayToObject, assets.value));
    return Effect.succeed({
      assets: Effect.runSync(arrayToObject(updatedAssets)),
    });
  };

  const hydrate = (hydrateStore: AssetsHydrate) => {
    const assetsList = Effect.runSync(objectToArray(hydrateStore.assets));
    const updatedAssets = Effect.runSync(formatAbilities(objectToArray, assetsList));
    assets.value = updatedAssets ?? assets.value;
  };

  return {
    addAsset,
    assets,
    dehydrate,
    hydrate,
  };
});

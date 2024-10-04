import { objectToArray, arrayToObject } from '@/utility/objectify';
import { createId } from '@paralleldrive/cuid2';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { starforged, type IAsset, type IAssetType } from 'dataforged';
import { Effect, pipe } from 'effect';
import type { Ability, AssetCategory, Asset} from './types/asset-types';
import { getAssetAbilities } from './helpers/assets';

export type AssetsHydrate = {
  assets: Asset[];
};

export interface AssetSubmission {
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  meter?: number
}

export const useAssetStore = defineStore('asset', () => {
  const assets: Ref<Array<Asset>> = ref([]);

const addAsset = (opts: AssetSubmission) => {
    const abilities: Ability[] = Effect.runSync(getAssetAbilities(opts.dataforgedId, opts.category))
    console.log(abilities)
    assets.value.push({
      _id: createId(),
      dataforgedId: opts.dataforgedId,
      name: opts.name,
      category: opts.category,
      abilities: {
        '1': abilities[0],
        '2': abilities[1],
        '3': abilities[2],
      },
      meter: opts.meter
    });
  }

  const dehydrate = () => {
    return {
      assets: arrayToObject(assets.value),
    };
  };

  const hydrate = (hydrateStore: AssetsHydrate) => {
    assets.value = objectToArray(hydrateStore.assets) ?? assets.value;
  };

  return {
    addAsset,
    assets,
    dehydrate,
    hydrate,
  };
});

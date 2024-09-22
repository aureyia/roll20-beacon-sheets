import { objectToArray, arrayToObject } from '@/utility/objectify';
import { createId } from '@paralleldrive/cuid2';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { starforged, type IAsset, type IAssetType } from 'dataforged';
import { Effect, pipe } from 'effect';

export type AssetCategory =
  | 'Command Vehicle'
  | 'Module'
  | 'Support Vehicle'
  | 'Path'
  | 'Companion'
  | 'Deed';

export type AssetsHydrate = {
  assets: Asset[];
};

export type Ability = {
  $id: string;
  enabled: boolean;
};

export type Asset = {
  _id: string;
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  abilities: Ability[];
};

export interface AssetSubmission {
  dataforgedId: string;
  name: string;
  category: AssetCategory;
}

const getCategory = (category: AssetCategory): Effect.Effect<IAssetType, Error> => {
  const selectedCategory = starforged['Asset Types'].find((x) => x.Name === category);

  if (!selectedCategory) {
    return Effect.fail(new Error(`No assets found for category: ${category}`));
  }

  return Effect.succeed(selectedCategory);
};

export const getAllAssetsForCategory = (
  category: AssetCategory,
): Effect.Effect<IAsset[], Error> => {
  const assets = Effect.runSync(getCategory(category)).Assets;

  if (assets.length > 0) {
    return Effect.succeed(assets);
  }

  return Effect.fail(new Error(`No assets found for Category: ${category}`));
};

const getAssetAbilities = (
  id: string,
  category: AssetCategory,
): Effect.Effect<Ability[], Error> => {
  const selectedCategory = starforged['Asset Types'].find((x) => x.Name === category);

  if (!selectedCategory) {
    return Effect.fail(new Error('No category found'));
  }

  const abilities = selectedCategory.Assets.find((x) => x.$id === id)?.Abilities;

  if (!abilities) {
    return Effect.fail(new Error('No abilities found for Asset'));
  }

  return Effect.succeed(abilities.map((x) => ({ $id: x.$id, enabled: x.Enabled })));
};

export const useAssetStore = defineStore('asset', () => {
  const assets: Ref<Array<Asset>> = ref([]);

  const addAsset = (opts: AssetSubmission) =>
    assets.value.push({
      _id: createId(),
      dataforgedId: opts.dataforgedId,
      name: opts.name,
      category: opts.category,
      abilities: Effect.runSync(getAssetAbilities(opts.dataforgedId, opts.category)),
    });

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

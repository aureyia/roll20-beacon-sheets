import { Data, Effect, pipe } from 'effect';
import { starforged, type IAsset, type IAssetType } from '@/vendor/dataforged';
import type { AssetCategory } from './types';
import { createId } from '@paralleldrive/cuid2';

export class AssetError extends Data.TaggedError('AssetError')<{
  message?: string;
}> {}

const getAssets = (assetType: IAssetType) => {
  return assetType.Assets;
};

const getAssetById = (assets: IAsset[], id: string) => {
  const asset: IAsset | undefined = assets.find((x) => x.$id === id);

  if (!asset) {
    return Effect.fail(
      new AssetError({ message: `Asset not found for ${id}` }),
    );
  }

  return Effect.succeed(asset);
};

export const getAssetType = (assetTypeName: AssetCategory) => {
  const selectedAssetType = starforged['Asset Types'].find(
    (x) => x.Name === assetTypeName,
  );
  if (!selectedAssetType) {
    return Effect.fail(
      new AssetError({
        message: `No assets found for category: ${assetTypeName}`,
      }),
    );
  }

  return Effect.succeed(selectedAssetType);
};

export const getAssetAbilities = (id: string, category: AssetCategory) => {
  const selectedCategory = starforged['Asset Types'].find(
    (x) => x.Name === category,
  );

  if (!selectedCategory) {
    return Effect.fail(new AssetError({ message: 'No category found' }));
  }

  const selectedAsset = selectedCategory.Assets.find(
    (x) => x.$id === id,
  )

  if (!selectedAsset) {
    return Effect.fail(
      new AssetError({ message: 'No asset found for id' }),
    );
  }

  if (!selectedAsset.Abilities) {
    return Effect.fail(
      new AssetError({ message: 'No abilities found for Asset' }),
    );
  }

  return Effect.succeed(
    selectedAsset.Abilities.map((x) => ({
      _id: createId(),
      dataforgedId: x.$id,
      enabled: x.Enabled,
    })),
  );
};

export const getAsset = (id: string, category: AssetCategory) =>
  pipe(
    category,
    getAssetType,
    Effect.map(getAssets),
    Effect.andThen((x) => getAssetById(x, id)),
  );

export const getAllAssetsForCategory = (category: AssetCategory) => {
  const selectedCategory = starforged['Asset Types'].find(
    (x) => x.Name === category,
  );

  if (!selectedCategory) {
    return Effect.fail(
      new AssetError({ message: `No assets found for category: ${category}` }),
    );
  }

  return Effect.succeed(selectedCategory.Assets);
};

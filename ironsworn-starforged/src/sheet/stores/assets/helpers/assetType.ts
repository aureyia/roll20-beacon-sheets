import { Effect, Either } from 'effect';
import {
  starforged,
  type IAssetType,
  type AssetTypeName,
  type IAsset,
} from 'dataforged';
import type { AssetCategory } from '../types/asset-types';

export const getCategory = (
  category: AssetCategory,
): Effect.Effect<IAssetType, Error> => {
  const selectedCategory = starforged['Asset Types'].find(
    (x) => x.Name === category,
  );

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

export const getAssetType = (
  assetTypeName: AssetCategory,
): Effect.Effect<IAssetType, Error> => {
  const selectedAssetType = starforged['Asset Types'].find(
    (x) => x.Name === assetTypeName,
  );
  if (!selectedAssetType) {
    return Effect.fail(
      new Error(`No assets found for category: ${assetTypeName}`),
    );
  }

  return Effect.succeed(selectedAssetType);
};

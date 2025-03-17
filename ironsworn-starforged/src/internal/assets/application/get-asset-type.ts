import { Effect } from 'effect';
import { starforged, type IAssetType } from 'dataforged';
import type { AssetCategory } from './types';

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

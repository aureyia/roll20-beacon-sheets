import { Effect, pipe, Either } from "effect";
import { 
  starforged, 
  type IAsset, 
  type IAssetType
} from "dataforged";
import { getAssetType } from "./assetType";
import type { Ability, AssetCategory } from "../types/asset-types";

const getAssets = (assetType: IAssetType):IAsset[] => {
  return assetType.Assets
}

const getAssetById = (assets:IAsset[], id: string): Effect.Effect<IAsset, Error> => {
  const asset: IAsset|undefined = assets.find((x) => x.$id === id)
  
  if(!asset) {
    return Effect.fail(new Error(`Asset not found for ${id}`))
  }

  return Effect.succeed(asset)
}

export const getAsset = (id: string, assetTypeName: AssetCategory):Effect.Effect<IAsset, Error> => {
  return pipe(
    assetTypeName,
    getAssetType,
    Effect.map(getAssets),
    Effect.andThen((x) => getAssetById(x, id))
  )
}

export const getAssetAbilities = (
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

  return Effect.succeed(abilities.map((x) => ({ id: x.$id, enabled: x.Enabled })));
};

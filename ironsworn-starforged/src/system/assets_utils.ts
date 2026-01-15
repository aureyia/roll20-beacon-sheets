import { createId } from '@paralleldrive/cuid2'
import { Data, Effect, pipe } from 'effect'
import { starforged } from '@/system/dataforged'
import type { IAsset, IAssetType } from '@/system/dataforged/types'
import type { AssetCategory } from './assets_types'

export class AssetError extends Data.TaggedError('AssetError')<{
    message?: string
}> {}

const get_asset_by_id = (assets: IAsset[], id: string) => {
    const asset: IAsset | undefined = assets.find(x => x.$id === id)

    if (!asset) {
        return Effect.fail(new AssetError({ message: `Asset not found for ${id}` }))
    }

    return Effect.succeed(asset)
}

export const get_asset_category = (category: AssetCategory) => {
    const selected_asset_category = starforged['Asset Types'].find(x => x.Name === category)

    if (!selected_asset_category) {
        return Effect.fail(
            new AssetError({
                message: `No assets found for category: ${category}`,
            })
        )
    }

    return Effect.succeed(selected_asset_category)
}

export const get_asset_abilities = (id: string, category: AssetCategory) => {
    const selectedCategory = starforged['Asset Types'].find(x => x.Name === category)

    if (!selectedCategory) {
        return Effect.fail(new AssetError({ message: 'No category found' }))
    }

    const selectedAsset = selectedCategory.Assets.find(x => x.$id === id)

    if (!selectedAsset) {
        return Effect.fail(new AssetError({ message: 'No asset found for id' }))
    }

    if (!selectedAsset.Abilities) {
        return Effect.fail(new AssetError({ message: 'No abilities found for Asset' }))
    }

    return Effect.succeed(
        selectedAsset.Abilities.map(x => ({
            _id: createId(),
            dataforged_id: x.$id,
            enabled: x.Enabled,
        }))
    )
}

export const get_asset = (id: string, category: AssetCategory) =>
    pipe(
        category,
        get_asset_category,
        Effect.map((assetType: IAssetType) => assetType.Assets),
        Effect.andThen(x => get_asset_by_id(x, id))
    )

export const get_all_assets_for_category = (category: AssetCategory) => {
    const category_selected = starforged['Asset Types'].find(x => x.Name === category)

    if (!category_selected) {
        return Effect.fail(
            new AssetError({
                message: `No assets found for category: ${category}`,
            })
        )
    }

    return Effect.succeed(category_selected.Assets)
}

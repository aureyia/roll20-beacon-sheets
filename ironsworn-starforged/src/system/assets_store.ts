import { createId } from '@paralleldrive/cuid2'
import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import type { Ability, Asset, AssetCategory } from '@/system/assets_types'
import { AssetError, get_asset_abilities } from '@/system/assets_utils'
import { array_to_object, object_to_array } from '@/utility/objectify'

export type AssetStore = {
    list: Asset[]
}

export interface AbilityUpdate {
    assetId: string
    id_ability: string
    value: boolean
}

export type AssetSubmission = {
    dataforged_id: string
    name: string
    category: AssetCategory
    meter: number | null
}

const abilities_format = (
    formatter: typeof object_to_array | typeof array_to_object,
    assets: Asset[]
) => {
    if (!assets) {
        return Effect.fail(new AssetError({ message: 'No assets were provided' }))
    }

    const assets_mapped = assets.map((asset) => {
        const abilities = Effect.runSync(formatter(asset.abilities))
        return {
            ...asset,
            abilities: abilities,
        }
    })

    return Effect.succeed(assets_mapped)
}

export const store_assets = createStore({
    context: {
        list: [] as Asset[],
    },
    emits: {
        updated: () => {},
    },
    on: {
        hydrate: (context: AssetStore, event: Asset[]) => {
            const list_asset = Effect.runSync(object_to_array(event))
            const assets_updated = Effect.runSync(abilities_format(object_to_array, list_asset))

            context.list = assets_updated ?? context.list
        },
        add: (context: AssetStore, event: AssetSubmission, enqueue) => {
            console.log(context, event)
            const abilities = Effect.runSync(
                get_asset_abilities(event.dataforged_id, event.category)
            )

            context.list.push({
                _id: createId(),
                dataforged_id: event.dataforged_id,
                name: event.name,
                category: event.category,
                abilities,
                meter: event.meter,
            })

            enqueue.emit.updated()
        },
        remove: (context, id: string, enqueue) => {
            context.list = context.list.filter((asset: Asset) => asset._id !== id)
            enqueue.emit.updated()
        },
        set: (context, event: SetEvent<AssetStore>, enqueue) => {
            context.list = event.value
            enqueue.emit.updated()
        },
        ability_update: (context, event: AbilityUpdate, enqueue) => {
            context.list.map((asset: Asset) => {
                if (asset._id === event.assetId) {
                    const abilities_updated = asset.abilities.map((ability: Ability) => {
                        if (ability._id === event.id_ability) {
                            ability.enabled = event.value
                        }

                        return ability
                    })

                    asset.abilities = abilities_updated
                    return asset
                }
                return asset
            })
            enqueue.emit.updated()
        },
        clear: (context, _, enqueue) => {
            context.list = []
            enqueue.emit.updated()
        },
    },
})

export class DehydrateAssets extends Context.Tag('DehydrateAssets')<
    DehydrateAssets,
    {
        // biome-ignore lint: Intentional any
        readonly dehydrate: () => Effect.Effect<Record<string, any>, AssetError>
    }
>() {}

export const live_dehydrate_assets = Layer.effect(
    DehydrateAssets,
    Effect.gen(function* () {
        return {
            dehydrate: () =>
                Effect.gen(function* () {
                    const context = store_assets.get().context.list as Asset[]
                    const assets_updated = yield* abilities_format(array_to_object, context)

                    return yield* array_to_object(assets_updated)
                }),
        }
    })
)

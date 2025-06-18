import { createId } from '@paralleldrive/cuid2'
import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import type { Ability, Asset, AssetCategory } from '@/system/assets/types'
import { AssetError, getAssetAbilities } from '@/system/assets/utils'
import { arrayToObject, objectToArray } from '@/utility/objectify'

export type AssetsHydrate = {
    assets: Asset[]
}

export type AssetStore = {
    list: Asset[]
}

export type UpdateAbility = {
    assetId: string
    abilityId: string
    value: boolean
}

export type AssetSubmission = {
    dataforgedId: string
    name: string
    category: AssetCategory
    meter: number | null
}

const formatAbilities = (
    formatter: typeof objectToArray | typeof arrayToObject,
    assets: AssetsHydrate | any
) => {
    if (!assets) {
        return Effect.fail(
            new AssetError({ message: 'No assets were provided' })
        )
    }

    const mappedAssets = assets.map((asset: any) => {
        const abilities = Effect.runSync(formatter(asset.abilities))
        return {
            ...asset,
            abilities: abilities,
        }
    })

    return Effect.succeed(mappedAssets)
}

export const assetsStore = createStore({
    context: {
        list: [] as Asset[],
    },
    emits: {
        updated: () => {},
    },
    on: {
        hydrate: (context: AssetStore, event: Asset[]) => {
            const assetList = Effect.runSync(objectToArray(event))
            const updatedAssets = Effect.runSync(
                formatAbilities(objectToArray, assetList)
            )

            context.list = updatedAssets ?? context.list
        },
        add: (context: AssetStore, event: AssetSubmission, enqueue) => {
            console.log(context, event)
            const abilities: Ability[] = Effect.runSync(
                getAssetAbilities(event.dataforgedId, event.category)
            )

            context.list.push({
                _id: createId(),
                dataforgedId: event.dataforgedId,
                name: event.name,
                category: event.category,
                abilities,
                meter: event.meter,
            })

            enqueue.emit.updated()
        },
        remove: (context, id: string, enqueue) => {
            context.list = context.list.filter(
                (asset: Asset) => asset._id !== id
            )
            enqueue.emit.updated()
        },
        set: (context, event: SetEvent<AssetStore>, enqueue) => {
            context.list = event.value
            enqueue.emit.updated()
        },
        updateAbility: (context, event: UpdateAbility, enqueue) => {
            context.list.map((asset: Asset) => {
                if (asset._id === event.assetId) {
                    const updatedAbilities = asset.abilities.map(
                        (ability: Ability) => {
                            if (ability._id === event.abilityId) {
                                ability.enabled = event.value
                            }

                            return ability
                        }
                    )

                    asset.abilities = updatedAbilities
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

export const DehydrateAssetsLive = Layer.effect(
    DehydrateAssets,
    Effect.gen(function* () {
        return {
            dehydrate: () =>
                Effect.gen(function* () {
                    const context = assetsStore.get().context.list as Asset[]
                    const updatedAssets = yield* formatAbilities(
                        arrayToObject,
                        context
                    )

                    return yield* arrayToObject(updatedAssets)
                }),
        }
    })
)

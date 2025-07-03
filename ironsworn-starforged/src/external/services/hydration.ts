import { Context, Effect, Layer } from 'effect'

import { store_meta as meta } from '@/external/store'
import { store_assets as assets } from '@/system/assets_store'
import { store_character as character } from '@/system/character.store'
import { store_impacts as impacts } from '@/system/impacts_store'
import { store_momentum as momentum } from '@/system/momentum_store'
import { store_resources as resources } from '@/system/resources.store'
import { store_settings as settings } from '@/system/settings.store'
import { store_stats as stats } from '@/system/stats.store'
import { store_tasks as tasks } from '@/system/tasks_store'

export class Hydration extends Context.Tag('Dehydration')<
    Hydration,
    {
        readonly hydrateStores: (context: any, meta: any) => void
    }
>() {}

export const live_hydration = Layer.effect(
    Hydration,
    Effect.gen(function* () {
        const stores = {
            meta,
            character,
            assets,
            stats,
            resources,
            momentum,
            impacts,
            settings,
            tasks,
        }

        return {
            hydrateStores: (context, metaData) => {
                const storeKeys = Object.keys(stores) as (keyof typeof stores)[]
                for (const key of storeKeys) {
                    if (key === 'meta') {
                        stores[key].send({ type: 'hydrate', ...metaData })
                    } else {
                        // @ts-ignore
                        stores[key].send({ type: 'hydrate', ...context[key] })
                    }
                }
            },
        }
    })
)

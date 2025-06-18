import { Context, Effect, Layer } from 'effect'

import { metaStore as meta } from '@/external/store'
import { assetsStore as assets } from '@/system/assets/store'
import { characterStore as character } from '@/system/character.store'
import { impactsStore as impacts } from '@/system/impacts/store'
import { momentumStore as momentum } from '@/system/momentum/store'
import { resourcesStore as resources } from '@/system/resources.store'
import { settingsStore as settings } from '@/system/settings.store'
import { statsStore as stats } from '@/system/stats.store'
import { tasksStore as tasks } from '@/system/tasks/store'

export class Hydration extends Context.Tag('Dehydration')<
    Hydration,
    {
        readonly hydrateStores: (context: any, meta: any) => void
    }
>() {}

export const HydrationLive = Layer.effect(
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

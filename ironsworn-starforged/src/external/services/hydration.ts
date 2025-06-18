import { Effect, Context, Layer, Hash } from 'effect'

import { metaStore as meta } from '@/external/store'
import { characterStore as character } from '@/system/character.store'
import { assetsStore as assets } from '@/system/assets/store'
import { statsStore as stats } from '@/system/stats.store'
import { resourcesStore as resources } from '@/system/resources.store'
import { momentumStore as momentum } from '@/system/momentum/store'
import { impactsStore as impacts } from '@/system/impacts/store'
import { settingsStore as settings } from '@/system/settings.store'
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
            const hashedIncomingContext = Hash.hash(context[key])
            const hashedStoreContext = stores[key].get().context.dehydratedHash

            if (hashedIncomingContext !== hashedStoreContext) {
              // @ts-ignore
              stores[key].send({ type: 'hydrate', ...context[key] })
            }
          }
        }
      },
    }
  })
)

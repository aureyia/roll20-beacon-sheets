import { createId } from '@paralleldrive/cuid2'
import { arrayToObject, objectToArray } from '@/utility/objectify'
import { assert } from '@/utility/assert'
import type {
  AnyImpact,
  Burden,
  CurrentVehicle,
  Impact,
  LastingEffect,
  Misfortune,
  Other,
} from '@/system/impacts/types'
import { Effect, Layer, Context } from 'effect'
import { createStore } from '@xstate/store'

export type AddImpact = {
  name: AnyImpact['name']
  category: AnyImpact['category']
  description?: string
}

export type ImpactsGrouped = {
  misfortunes: Misfortune[]
  lastingEffects: LastingEffect[]
  burdens: Burden[]
  currentVehicle: CurrentVehicle[]
  other: Other[]
}

const isValidCategory = (category: string) => {
  return [
    'misfortunes',
    'lastingEffects',
    'burdens',
    'currentVehicle',
    'other',
  ].includes(category)
}

const filterOutImpact = (context: ImpactsGrouped, event: AnyImpact) =>
  context[event.category].filter(
    (entry: AnyImpact) => entry.name !== event.name
  )

function assertAddImpact(data: AddImpact) {
  assert(!!data.category)
  assert(!!data.name)
  assert(isValidCategory(data.category))
}

function assertRemoveImpact(data: AnyImpact) {
  assert(!!data.category)
  assert(!!data._id)
  assert(isValidCategory(data.category))
}

export type HydrateEvent = {
  // biome-ignore lint: Intentional any
  misfortunes: Record<string, any>
  // biome-ignore lint: Intentional any
  lastingEffects: Record<string, any>
  // biome-ignore lint: Intentional any
  burdens: Record<string, any>
  // biome-ignore lint: Intentional any
  currentVehicle: Record<string, any>
  // biome-ignore lint: Intentional any
  other: Record<string, any>
}

export const impactsStore = createStore({
  context: {
    misfortunes: [] as Misfortune[],
    lastingEffects: [] as LastingEffect[],
    burdens: [] as Burden[],
    currentVehicle: [] as CurrentVehicle[],
    other: [] as Other[],
  },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context, event: HydrateEvent) => {
      context.misfortunes =
        Effect.runSync(objectToArray(event.misfortunes)) ?? context.misfortunes
      context.lastingEffects =
        Effect.runSync(objectToArray(event.lastingEffects)) ??
        context.lastingEffects
      context.burdens =
        Effect.runSync(objectToArray(event.burdens)) ?? context.burdens
      context.currentVehicle =
        Effect.runSync(objectToArray(event.currentVehicle)) ??
        context.currentVehicle
      context.other =
        Effect.runSync(objectToArray(event.other)) ?? context.other
    },
    add: (context, event: AddImpact, enqueue) => {
      console.log('event', event)
      assertAddImpact(event)

      const impact: AnyImpact = {
        ...event,
        _id: createId(),
      }

      // biome-ignore lint: Intentional any
      context[event.category].push(impact as any)
      enqueue.emit.updated()
    },
    remove: (context, event: AnyImpact, enqueue) => {
      assertRemoveImpact(event)
      filterOutImpact(context, event)
      enqueue.emit.updated()
    },
    set: (context: ImpactsGrouped, event: SetEvent<ImpactsGrouped>, enqueue) => {
      switch (event.label) {
        case 'misfortunes':
          context.misfortunes = event.value
          break;
        case 'burdens':
          context.burdens = event.value
          break
        case 'currentVehicle':
          context.currentVehicle = event.value
          break
        case 'lastingEffects':
          context.lastingEffects = event.value
          break
        case 'other':
          context.other = event.value
          break
        default:
          throw new Error('Unsupported impact')
      } enqueue.emit.updated()
    },
    clear: context => {
      context.misfortunes = []
      context.lastingEffects = []
      context.burdens = []
      context.currentVehicle = []
      context.other = []
    },
  },
})

export class DehydrateImpacts extends Context.Tag('DehydrateImpacts')<
  DehydrateImpacts,
  {
    // biome-ignore lint: Intentional any
    readonly dehydrate: () => Effect.Effect<Record<string, any>, Error, never>
  }
>() {}

export const DehydrateImpactsLive = Layer.effect(
  DehydrateImpacts,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = impactsStore.get().context
          return {
            misfortunes: yield* arrayToObject(context.misfortunes),
            lastingEffects: yield* arrayToObject(context.lastingEffects),
            burdens: yield* arrayToObject(context.burdens),
            currentVehicle: yield* arrayToObject(context.currentVehicle),
            other: yield* arrayToObject(context.other),
          }
        }),
    }
  })
)

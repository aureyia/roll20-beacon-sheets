import { createId } from '@paralleldrive/cuid2'
import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import type {
    AnyImpact,
    Burden,
    CurrentVehicle,
    LastingEffect,
    Misfortune,
    Other,
} from '@/system/impacts/types'
import { assert } from '@/utility/assert'
import { array_to_object, object_to_array } from '@/utility/objectify'

export type AddImpact = {
    name: AnyImpact['name']
    category: AnyImpact['category']
    description?: string
}

export type ImpactsGrouped = {
    misfortunes: Misfortune[]
    lasting_effects: LastingEffect[]
    burdens: Burden[]
    current_vehicle: CurrentVehicle[]
    other: Other[]
}

const isValidCategory = (category: string) => {
    return ['misfortunes', 'lasting_effects', 'burdens', 'current_vehicle', 'other'].includes(
        category
    )
}

const filterOutImpact = (context: ImpactsGrouped, event: AnyImpact) =>
    context[event.category].filter((entry: AnyImpact) => entry.name !== event.name)

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
    lasting_effects: Record<string, any>
    // biome-ignore lint: Intentional any
    burdens: Record<string, any>
    // biome-ignore lint: Intentional any
    current_vehicle: Record<string, any>
    // biome-ignore lint: Intentional any
    other: Record<string, any>
}

export const store_impacts = createStore({
    context: {
        misfortunes: [] as Misfortune[],
        lasting_effects: [] as LastingEffect[],
        burdens: [] as Burden[],
        current_vehicle: [] as CurrentVehicle[],
        other: [] as Other[],
    },
    emits: {
        updated: () => {},
    },
    on: {
        hydrate: (context, event: HydrateEvent) => {
            context.misfortunes =
                Effect.runSync(object_to_array(event.misfortunes)) ?? context.misfortunes
            context.lasting_effects =
                Effect.runSync(object_to_array(event.lasting_effects)) ?? context.lasting_effects
            context.burdens = Effect.runSync(object_to_array(event.burdens)) ?? context.burdens
            context.current_vehicle =
                Effect.runSync(object_to_array(event.current_vehicle)) ?? context.current_vehicle
            context.other = Effect.runSync(object_to_array(event.other)) ?? context.other
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
                    break
                case 'burdens':
                    context.burdens = event.value
                    break
                case 'current_vehicle':
                    context.current_vehicle = event.value
                    break
                case 'lasting_effects':
                    context.lasting_effects = event.value
                    break
                case 'other':
                    context.other = event.value
                    break
                default:
                    throw new Error('Unsupported impact')
            }
            enqueue.emit.updated()
        },
        clear: context => {
            context.misfortunes = []
            context.lasting_effects = []
            context.burdens = []
            context.current_vehicle = []
            context.other = []
        },
    },
})

export class DehydrateImpacts extends Context.Tag('DehydrateImpacts')<
    DehydrateImpacts,
    {
        readonly dehydrate: () => Effect.Effect<
            // biome-ignore lint: Intentional any
            Record<string, any>,
            Error,
            never
        >
    }
>() {}

export const live_dehydrate_impacts = Layer.effect(
    DehydrateImpacts,
    Effect.gen(function* () {
        return {
            dehydrate: () =>
                Effect.gen(function* () {
                    const context = store_impacts.get().context
                    return {
                        misfortunes: yield* array_to_object(context.misfortunes),
                        lasting_effects: yield* array_to_object(context.lasting_effects),
                        burdens: yield* array_to_object(context.burdens),
                        current_vehicle: yield* array_to_object(context.current_vehicle),
                        other: yield* array_to_object(context.other),
                    }
                }),
        }
    })
)

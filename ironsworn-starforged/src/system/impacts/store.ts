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

const filterOutImpact = (context: any, event: AnyImpact) =>
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
    misfortunes: {}
    lastingEffects: {}
    burdens: {}
    currentVehicle: {}
    other: {}
}

type SetEvent = {
    label: keyof ImpactsGrouped
    value: ImpactsGrouped[keyof ImpactsGrouped][]
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
                Effect.runSync(objectToArray(event.misfortunes)) ??
                context.misfortunes
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

            context[event.category].push(impact as any)
            enqueue.emit.updated()
        },
        remove: (context, event: AnyImpact, enqueue) => {
            assertRemoveImpact(event)
            filterOutImpact(context, event)
            enqueue.emit.updated()
        },
        set: (context, event: SetEvent, enqueue) => {
            context[event.label] = event.value
            enqueue.emit.updated()
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
        readonly dehydrate: () => Effect.Effect<
            Record<string, any>,
            Error,
            never
        >
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
                        lastingEffects: yield* arrayToObject(
                            context.lastingEffects
                        ),
                        burdens: yield* arrayToObject(context.burdens),
                        currentVehicle: yield* arrayToObject(
                            context.currentVehicle
                        ),
                        other: yield* arrayToObject(context.other),
                    }
                }),
        }
    })
)

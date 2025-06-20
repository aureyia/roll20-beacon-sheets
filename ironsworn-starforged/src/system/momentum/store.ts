import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import { assert } from '@/utility/assert'
import { is_number_between } from '@/utility/is_number_between'

export type MomentumHydrate = {
    momentum: number
}

const momentum_assert = (momentum: number) => {
    assert(is_number_between(momentum, -6, 10))
}

export const store_momentum = createStore({
    context: { momentum: 2 },
    emits: {
        updated: () => {},
    },
    on: {
        hydrate: (context, event: { momentum: number }) => {
            context.momentum = event.momentum ?? context.momentum
        },
        set: (context, event: { value: number }, enqueue) => {
            context.momentum = event.value
            enqueue.emit.updated()
        },
    },
})

export class DehydrateMomentum extends Context.Tag('DehydrateMomentum')<
    DehydrateMomentum,
    {
        readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>
    }
>() {}

export const live_dehydrate_momentum = Layer.effect(
    DehydrateMomentum,
    Effect.gen(function* () {
        return {
            dehydrate: () =>
                Effect.gen(function* () {
                    return yield* Effect.succeed({
                        momentum: store_momentum.get().context.momentum,
                    })
                }),
        }
    })
)

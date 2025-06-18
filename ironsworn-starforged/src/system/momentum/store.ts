import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import { assert } from '@/utility/assert'
import { isNumberBetween } from '@/utility/is-number-between'

export type MomentumHydrate = {
  momentum: number
}

const assertMomentum = (momentum: number) => {
  assert(isNumberBetween(momentum, -6, 10))
}

export const momentumStore = createStore({
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

export const DehydrateMomentumLive = Layer.effect(
  DehydrateMomentum,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          return yield* Effect.succeed({
            momentum: momentumStore.get().context.momentum,
          })
        }),
    }
  })
)

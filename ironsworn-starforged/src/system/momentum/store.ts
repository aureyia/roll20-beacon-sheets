import { assertEffect } from '@/utility/assertEffect';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  assertEffect(isNumberBetween(momentum, -6, 10), `values.momentum: ${momentum}`);
};

export const momentumStore = createStore({
  context: { momentum: 2 },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context, event: { momentum: number }) => {
      context.momentum = event.momentum ?? context.momentum;
    },
    set: (context, event: { value: number }, enqueue) => {
      context.momentum = event.value;
      enqueue.emit.updated();
    },
  },
});

export class DehydrateMomentum extends Context.Tag('DehydrateMomentum')<
  DehydrateMomentum,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateMomentumLive = Layer.effect(
  DehydrateMomentum,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          return { momentum: momentumStore.get().context.momentum };
        }),
    };
  }),
);

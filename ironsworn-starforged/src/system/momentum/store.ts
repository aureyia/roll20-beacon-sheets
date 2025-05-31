import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  console.log(isNumberBetween(momentum, -6, 10))
  assert(isNumberBetween(momentum, -6, 10), `values.momentum: ${momentum}`);
};

export const momentumStore = createStore({
  context: { momentum: 2 },
  on: {
    hydrate: (context, event: { momentum: number }) => {
      console.log('event.momentum', event.momentum)
      // assertMomentum(event.momentum);
      context.momentum = event.momentum ?? context.momentum;
    },
    set: (context, event: { value: number }) => {
      context.momentum = event.value;
    },
  },
});

export class DehydrateMomentum extends Context.Tag('DehydrateMomentum')<
  DehydrateMomentum,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateMomentumLive =
  Layer.effect(
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

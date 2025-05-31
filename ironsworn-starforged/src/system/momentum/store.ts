import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { createStore } from '@xstate/store';
import { sync } from '@/external/sync';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  assert(isNumberBetween(momentum, -6, 10), `values.momentum: ${momentum}`);
};

export const momentumStore = createStore({
  context: { momentum: 2 },
  on: {
    hydrate: (context, event: { momentum: number }) => {
      assertMomentum(event.momentum);
      context.momentum = event.momentum ?? context.momentum;
    },
    set: (context, event: { value: number }) => {
      context.momentum = event.value
      sync.send({ type: 'update' });
    },
  },
});

export const dehydrate = () =>
  ({ momentum: momentumStore.get().context.momentum })
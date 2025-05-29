import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { createStore } from '@xstate/store';

export type MomentumHydrate = {
  momentum: number;
};

const assertMomentum = (momentum: number) => {
  assert(isNumberBetween(momentum, -6, 10), `values.momentum: ${momentum}`);
};

export const momentumStore = createStore({
  context: { momentum: 2 },
  on: {
    set: (context, event: { value: number }) => ({
      momentum: (context.momentum = event.value),
    }),
    hydrate: (context, event: { momentum: number }) => {
      assertMomentum(event.momentum);
      context.momentum = event.momentum ?? context.momentum;
    },
  },
});

export const dehydrate = () =>
  ({ momentum: momentumStore.get().context.momentum })
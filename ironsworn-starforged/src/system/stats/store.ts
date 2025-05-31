import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Effect } from 'effect';
import { assert } from '@/utility/assert';
import { createStore } from '@xstate/store';
import { sync } from '@/external/sync';

export type Stats = {
  edge: number;
  heart: number;
  iron: number;
  shadow: number;
  wits: number;
};

const assertStoreValues = (values: any) => {
  assert(
    typeof values.edge === 'number',
    `values.edge type: ${typeof values.edge}`,
  );
  assert(
    typeof values.heart === 'number',
    `values.heart type: ${typeof values.heart}`,
  );
  assert(
    typeof values.iron === 'number',
    `values.edge type: ${typeof values.iron}`,
  );
  assert(
    typeof values.shadow === 'number',
    `values.edge type: ${typeof values.shadow}`,
  );
  assert(
    typeof values.wits === 'number',
    `values.edge type: ${typeof values.wits}`,
  );
};

export const statStore = createStore({
  context: {
    edge: 0,
    heart: 0,
    iron: 0,
    shadow: 0,
    wits: 0,
  },
  on: {
    set: (context, event: { label: keyof Stats, value: number }) => {
      context[event.label] = event.value
      sync.send({ type: 'update' });
    },
    hydrate: (context, event: Stats) => {
      context['edge'] = event.edge
      context['heart'] = event.heart
      context['iron'] = event.iron
      context['shadow'] = event.shadow
      context['wits'] = event.wits
    }
  }
})
import { Effect, Layer, Context } from 'effect';
import { assertEffect } from '@/utility/assertEffect';
import { createStore } from '@xstate/store';
import type { SetEvent } from '@/utility/store-types';

type StatsSetEvent = SetEvent<Stats>;

export type Stats = {
  edge: number;
  heart: number;
  iron: number;
  shadow: number;
  wits: number;
};

const assertEffecttoreValues = (values: any) => {
  assertEffect(
    typeof values.edge === 'number',
    `values.edge type: ${typeof values.edge}`,
  );
  assertEffect(
    typeof values.heart === 'number',
    `values.heart type: ${typeof values.heart}`,
  );
  assertEffect(
    typeof values.iron === 'number',
    `values.edge type: ${typeof values.iron}`,
  );
  assertEffect(
    typeof values.shadow === 'number',
    `values.edge type: ${typeof values.shadow}`,
  );
  assertEffect(
    typeof values.wits === 'number',
    `values.edge type: ${typeof values.wits}`,
  );
};

export const statsStore = createStore({
  context: {
    edge: 0,
    heart: 0,
    iron: 0,
    shadow: 0,
    wits: 0,
  },
  emits: {
    updated: () => {},
  },
  on: {
    set: (context, event: StatsSetEvent, enqueue) => {
      context[event.label] = event.value;
      enqueue.emit.updated();
    },
    hydrate: (context, event: Stats) => {
      context['edge'] = event.edge ?? context['edge'];
      context['heart'] = event.heart ?? context['edge'];
      context['iron'] = event.iron ?? context['edge'];
      context['shadow'] = event.shadow ?? context['edge'];
      context['wits'] = event.wits ?? context['edge'];
    },
  },
});

export class DehydrateStats extends Context.Tag('DehydrateStats')<
  DehydrateStats,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateStatsLive = Layer.effect(
  DehydrateStats,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = statsStore.get().context;
          return {
            edge: context.edge,
            heart: context.heart,
            iron: context.iron,
            shadow: context.shadow,
            wits: context.wits,
          };
        }),
    };
  }),
);

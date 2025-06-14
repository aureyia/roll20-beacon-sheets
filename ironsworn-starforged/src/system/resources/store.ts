import { createStore } from '@xstate/store';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/is-number-between';
import { Effect, Layer, Context } from 'effect';
import type { SetEvent } from '@/utility/store.types';

type ResourcesSetEvent = SetEvent<Resources>;

type Resources = {
  health: number;
  spirit: number;
  supply: number;
  xp: number;
  spentXp: number;
};

type ResourcesHydrate = {
  context: {
    health: number;
    spirit: number;
    supply: number;
    xp: number;
    spentXp: number;
  };
};

type ModifyEvent = {
  label: keyof Resources;
  by: number;
};

const RESOURCE_LIMIT = {
  health: true,
  spirit: true,
  supply: true,
  xp: false,
  spentXp: false,
} as const;

const isResourceWithMaximum = (resource: keyof Resources) =>
  RESOURCE_LIMIT[resource];

const asserttoreValues = (values: any) => {
  assert(isNumberBetween(values.health, 0, 5));
  assert(isNumberBetween(values.spirit, 0, 5));
  assert(isNumberBetween(values.supply, 0, 5));
  assert(values.xp >= 0);
  assert(values.spentXp >= 0);
};

export const resourcesStore = createStore({
  context: {
    health: 5,
    spirit: 5,
    supply: 5,
    xp: 0,
    spentXp: 0,
  },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context, event: Resources) => {
      context['health'] = event.health ?? context['health'];
      context['spirit'] = event.spirit ?? context['spirit'];
      context['supply'] = event.supply ?? context['supply'];
      context['xp'] = event.xp ?? context['xp'];
      context['spentXp'] = event.spentXp ?? context['spentXp'];
    },
    set: (context, event: ResourcesSetEvent, enqueue) => {
      context[event.label] = event.value;
      enqueue.emit.updated();
    },
    increase: (context, event: ModifyEvent, enqueue) => {
      const newValue = context[event.label] + event.by;

      if (isResourceWithMaximum(event.label)) {
        context[event.label] = Math.min(5, newValue);
      } else {
        context[event.label] = newValue;
      }
      enqueue.emit.updated();
    },
    descrease: (context, event: ModifyEvent, enqueue) => {
      context[event.label] = Math.max(0, context[event.label] - event.by);
      enqueue.emit.updated();
    },
  },
});

export class DehydrateResources extends Context.Tag('DehydrateResources')<
  DehydrateResources,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateResourcesLive = Layer.effect(
  DehydrateResources,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = resourcesStore.get().context;
          return {
            health: context.health,
            spirit: context.spirit,
            supply: context.supply,
            xp: context.xp,
            spentXp: context.spentXp,
          };
        }),
    };
  }),
);

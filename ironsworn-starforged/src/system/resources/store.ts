import { createStore } from '@xstate/store';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { Effect, Layer, Context } from 'effect';

type SetEvent = {
  resource: keyof Resources;
  value: number;
};

type Resources = {
  health: number;
  spirit: number;
  supply: number;
  xp: number;
  spentXp: number;
};

type ModifyEvent = {
  resource: keyof Resources;
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

const assertStoreValues = (values: any) => {
  assert(
    isNumberBetween(values.health, 0, 5),
    `values.health: ${values.health}`,
  );
  assert(
    isNumberBetween(values.spirit, 0, 5),
    `values.spirit: ${values.spirit}`,
  );
  assert(
    isNumberBetween(values.supply, 0, 5),
    `values.supply: ${values.supply}`,
  );
  assert(values.xp >= 0, `values.xp: ${values.xp}`);
  assert(values.spentXp >= 0, `values.spentXp: ${values.spentXp}`);
};

export const resourcesStore = createStore({
  context: {
    health: 5,
    spirit: 5,
    supply: 5,
    xp: 0,
    spentXp: 0,
  },
  on: {
    hydrate: (context, event: Resources) => {
      // assertStoreValues(event);
      context['health'] = event.health ?? context['health'];
      context['spirit'] = event.spirit ?? context['spirit'];
      context['supply'] = event.supply ?? context['supply'];
      context['xp'] = event.xp ?? context['xp'];
      context['spentXp'] = event.spentXp ?? context['spentXp'];
    },
    set: (context, event: SetEvent) => {
      context[event.resource] = event.value;
    },
    increase: (context, event: ModifyEvent) => {
      const newValue = context[event.resource] + event.by;

      if (isResourceWithMaximum(event.resource)) {
        context[event.resource] = Math.min(5, newValue);
      } else {
        context[event.resource] = newValue;
      }
    },
    descrease: (context, event: ModifyEvent) => {
      context[event.resource] = Math.max(0, context[event.resource] - event.by);
    },
  },
});

export class DehydrateResources extends Context.Tag('DehydrateResources')<
  DehydrateResources,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateResourcesLive =
  Layer.effect(
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

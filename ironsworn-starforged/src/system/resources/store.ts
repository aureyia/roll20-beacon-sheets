import { createStore } from '@xstate/store';
import { assert } from '@/utility/assert';
import { isNumberBetween } from '@/utility/isNumberBetween';
import { sync } from '@/external/sync';

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
      assertStoreValues(event);
      context['health'] = event.health;
      context['spirit'] = event.spirit;
      context['supply'] = event.supply;
      context['xp'] = event.xp;
      context['spentXp'] = event.spentXp;
    },
    set: (context, event: SetEvent) => {
      context[event.resource] = event.value;
      sync.send({ type: 'update' });
    },
    increase: (context, event: ModifyEvent) => {
      const newValue = context[event.resource] + event.by;

      if (isResourceWithMaximum(event.resource)) {
        context[event.resource] = Math.min(5, newValue);
      } else {
        context[event.resource] = newValue;
      }

      sync.send({ type: 'update' });
    },
    descrease: (context, event: ModifyEvent) => {
      context[event.resource] = Math.max(0, context[event.resource] - event.by);
      sync.send({ type: 'update' });
    },
  },
});

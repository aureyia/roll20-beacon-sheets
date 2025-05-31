import { createId } from '@paralleldrive/cuid2';
import { arrayToObject, objectToArray } from '@/utility/objectify';
import { assert } from '@/utility/assert';
import type {
  AnyImpact,
  Burden,
  CurrentVehicle,
  LastingEffect,
  Misfortune,
  Other,
} from '@/system/impacts/types';
import { Effect } from 'effect';
import { createStore } from '@xstate/store';
import { sync } from '@/external/sync';

export type AddImpact = {
  _id: string,
  name: AnyImpact['name'];
  category: AnyImpact['category'];
  description?: string;
};

export type ImpactsGrouped = {
  misfortunes: Misfortune[];
  lastingEffects: LastingEffect[];
  burdens: Burden[];
  currentVehicle: CurrentVehicle[];
  other: Other[];
};

const isValidCategory = (category: string) =>
  [
    'misfortunes',
    'lastingEffects',
    'burdens',
    'currentVehicle',
    'other',
  ].includes(category);

const filterOutImpact = (context: any, event: AnyImpact) =>
  context[event.category].filter(
    (entry: AnyImpact) => entry.name !== event.name,
  );

function assertAddImpact(data: AddImpact) {
  assert(!data.category, 'Category is required when adding an impact');
  assert(!data.name, 'Option is required when adding an impact');
  assert(!isValidCategory(data.category), `Unknown category: ${data.category}`);
}

function assertRemoveImpact(data: AnyImpact) {
  assert(!data.category, 'Category is required when adding an impact');
  assert(!data._id, '_id is required when removing an impact');
  assert(!isValidCategory(data.category), `Unknown category: ${data.category}`);
}

export type HydrateEvent = {
  misfortunes: {};
  lastingEffects: {};
  burdens: {};
  currentVehicle: {};
  other: {};
};

export const impactsStore = createStore({
  context: {
    misfortunes: [] as Misfortune[],
    lastingEffects: [] as LastingEffect[],
    burdens: [] as Burden[],
    currentVehicle: [] as CurrentVehicle[],
    other: [] as Other[],
  },
  on: {
    hydrate: (context, event: HydrateEvent) => {
      context.misfortunes = Effect.runSync(objectToArray(event.misfortunes));
      context.lastingEffects = Effect.runSync(
        objectToArray(event.lastingEffects),
      );
      context.burdens = Effect.runSync(objectToArray(event.burdens));
      context.currentVehicle = Effect.runSync(
        objectToArray(event.currentVehicle),
      );
      context.other = Effect.runSync(objectToArray(event.other));
    },
    add: (context, event: AddImpact) => {
      assertAddImpact(event);

      context[event.category].push({
        ...event,
        _id: createId(),
      });

      sync.send({ type: 'update' });
    },
    remove: (context, event: AnyImpact) => {
      assertRemoveImpact(event);
      filterOutImpact(context, event);

      sync.send({ type: 'update' });
    },
  },
});

export const dehydrate = (impacts: ImpactsGrouped) =>
  Effect.gen(function* () {
    return {
      impacts: {
        misfortunes: yield* arrayToObject(impacts.misfortunes),
        lastingEffects: yield* arrayToObject(impacts.lastingEffects),
        burdens: yield* arrayToObject(impacts.burdens),
        currentVehicle: yield* arrayToObject(impacts.currentVehicle),
        other: yield* arrayToObject(impacts.other),
      },
    };
  });

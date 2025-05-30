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


type AddImpact = {
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
    hydrate: (context: any, event: HydrateEvent) =>
      Effect.gen(function* () {
        context.misfortunes = yield* objectToArray(event.misfortunes);
        context.lastingEffects = yield* objectToArray(event.lastingEffects);
        context.burdens = yield* objectToArray(event.burdens);
        context.currentVehicle = yield* objectToArray(event.currentVehicle);
        context.other = yield* objectToArray(event.other);
      }),
    add: (context: any, event: AddImpact) => {
      assertAddImpact(event);
      context['misfortunes'].push({
        _id: createId(),
        ...event
      });
    },
    remove: (context: any, event: AnyImpact) => {
      assertRemoveImpact(event);
      filterOutImpact(context, event);
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

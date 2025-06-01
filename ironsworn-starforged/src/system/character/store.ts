import { assert } from '@/utility/assert';
import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';
import type { SetEvent } from '@/utility/store-types';

type CharacterSetEvent = SetEvent<Character>;

export type Character = {
  callsign: string;
  pronouns: string;
};

const asserttoreValues = (values: any) => {
  assert(
    typeof values.callsign === 'string',
    `invalid callsign type: ${values.callsign}`,
  );
  assert(
    typeof values.pronouns === 'string',
    `invalid pronouns type: ${values.pronouns}`,
  );
};

export const characterStore = createStore({
  context: {
    callsign: '',
    pronouns: '',
  },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (context, event: Character) => {
      context['callsign'] = event.callsign ?? context['callsign'];
      context['pronouns'] = event.pronouns ?? context['callsign'];
    },
    set: (context, event: CharacterSetEvent, enqueue) => {
      context[event.label] = event.value;
      enqueue.emit.updated();
    },
  },
});

export class DehydrateCharacter extends Context.Tag('DehydrateCharacter')<
  DehydrateCharacter,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateCharacterLive = Layer.effect(
  DehydrateCharacter,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = characterStore.get().context;
          return {
            callsign: context.callsign,
            pronouns: context.pronouns,
          };
        }),
    };
  }),
);

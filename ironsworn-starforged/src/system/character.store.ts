import { assert } from '@/utility/assert';
import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';
import type { SetEvent } from '@/utility/store.types';

type CharacterSetEvent = SetEvent<Character>;

export type Character = {
  callsign: string;
  pronouns: string;
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
      assert(typeof event.callsign === 'string');
      assert(typeof event.pronouns === 'string');
      context['callsign'] = event.callsign ?? context['callsign'];
      context['pronouns'] = event.pronouns ?? context['callsign'];
    },
    set: (context, event: CharacterSetEvent, enqueue) => {
      assert(typeof event.value === 'string');
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
          assert(typeof context.callsign === 'string');
          assert(typeof context.pronouns === 'string');

          return {
            callsign: context.callsign,
            pronouns: context.pronouns,
          };
        }),
    };
  }),
);

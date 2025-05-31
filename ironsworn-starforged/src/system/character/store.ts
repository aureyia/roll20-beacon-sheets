import { assert } from '@/utility/assert';
import { sync } from '@/external/sync';
import { createStore } from '@xstate/store';

export type Character = {
  callsign: string;
  pronouns: string;
};

const assertStoreValues = (values: any) => {
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
  on: {
    hydrate: (context, event: Character) => {
      assertStoreValues(event)
      context['callsign'] = event.callsign
      context['pronouns'] = event.pronouns
    },
    set: (context, event: { label: keyof Character, value: string }) => {
      context[event.label] = event.value
      sync.send({ type: 'update' });
    }
  }
})
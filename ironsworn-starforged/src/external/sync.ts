import { setup, createActor, assertEvent } from 'xstate';
import { Effect, pipe } from 'effect';
import type { ActorRefFrom } from 'xstate';
import { createId } from '@paralleldrive/cuid2';
import {
  type Character,
  type CompendiumDragDropData,
  type Dispatch,
  type Settings,
  type UpdateArgs,
} from '@roll20-official/beacon-sdk';
import { type App, reactive, ref, watch, nextTick } from 'vue';
import { metaStore } from './store';
import { Dehydration, DehydrationLive } from './services/dehydration';
import { Hydration, HydrationLive } from './services/hydration';

export const beaconPulse = ref(0);

export type InitValues = {
  id: string;
  character: Character;
  settings: Settings;
  compendiumDrop: CompendiumDragDropData | null;
};

export const initValues: InitValues = reactive({
  id: '',
  character: {
    attributes: {},
  } as Character,
  settings: {} as Settings,
  compendiumDrop: null,
});

const sheetId = ref(createId());

const update = (dispatch: Dispatch, data: any) =>
  Effect.gen(function* () {
    const dehydration = yield* Dehydration;
    const character: Record<string, any> = {};

    const char: Record<string, any> = {
      character: {
        id: initValues.character.id,
        attributes: {
          character: {
            character: {
              callsign: '',
              pronouns: '',
            },
          },
          stats: {
            stats: {
              edge: 3,
              heart: 3,
              iron: 3,
              shadow: 2,
              wits: 3,
            },
          },
          resources: {
            resources: {
              health: 5,
              spirit: 5,
              supply: 4,
              xp: 0,
              spentXp: 0,
            },
          },
          impacts: {
            impacts: {
              misfortunes: {},
              lastingEffects: {},
              burdens: {},
              currentVehicle: {},
              other: {},
            },
          },
          settings: {
            settings: {
              mode: 'character-standard',
              darkMode: 'unset',
            },
          },
          tasks: {
            tasks: {
              uqonbxdsc4z6e2sj4gcx2029: {
                arrayPosition: 0,
                category: 'vow',
                description: 'jhjk',
                difficulty: 'formidable',
                progress: 0,
                status: 'active',
              },
            },
          },
          assets: {
            assets: {},
          },
          momentum: {
            momentum: 4,
          },
          updateId: 'udr7exupbdsjwdhe2blmcu79',
        },
        name: 'Yha Eshe',
        bio: '',
        gmNotes: '',
        avatar: '',
      },
    };
    character.character.attributes = yield* dehydration.dehydrateStores();
    character.character.attributes.updateId = sheetId.value;
    dispatch.updateCharacter(character as UpdateArgs);
  }).pipe(Effect.provide(DehydrationLive));

export type SyncActor = ActorRefFrom<typeof machine>;
export const machine = setup({
  types: {
    context: {} as {
      character: any;
      dispatch?: Dispatch;
      updateId: string;
    },
    events: {} as
      | { type: 'initialised'; dispatch: Dispatch }
      | { type: 'update' }
      | { type: 'synced' }
      | { type: 'hydrated' },
  },
  actions: {
    saveDispatchToContext: function ({ context, event }) {
      assertEvent(event, 'initialised');
      context.dispatch = event.dispatch;
    },
  },
}).createMachine({
  context: {
    character: {
      id: '',
      character: {
        attributes: {},
      } as Character,
      settings: {} as Settings,
      compendiumDrop: null,
    },
    updateId: '',
  },
  id: 'Syncing',
  initial: 'initialising',
  states: {
    initialising: {
      on: {
        initialised: {
          target: 'hydrating',
          actions: {
            type: 'saveDispatchToContext',
          },
        },
      },
    },
    hydrating: {
      on: {
        update: {
          target: 'syncing',
        },
      },
    },
    syncing: {
      on: {
        synced: {
          target: 'hydrating',
        },
      },
    },
  },
});

export const sync = createActor(machine);
export const syncPlugin = (dispatch: Dispatch) =>
  Effect.gen(function* () {
    sync.subscribe(async (snapshot) => {
      console.log('sync: snapshot', snapshot);

      if (snapshot.value === 'initialising') {
        metaStore.send({
          type: 'setCampaignId',
          id: initValues.settings.campaignId,
        });

        metaStore.send({
          type: 'setPermissions',
          isOwner: initValues.settings.owned,
          isGM: initValues.settings.gm,
        });

        sync.send({
          type: 'initialised',
          dispatch: dispatch,
        });
      }

      if (snapshot.value === 'hydrating') {
        const characterId = initValues.character.id;
        const { attributes, ...profile } = dispatch.characters[characterId];

        if (attributes.updateId === sheetId.value) {
          return;
        }

        Effect.runPromise(
          Effect.gen(function* () {
            const hydration = yield* Hydration;

            return hydration.hydrateStores(attributes);
          }).pipe(Effect.provide(HydrationLive)),
        );

        await nextTick();
      }

      if (snapshot.value === 'syncing') {
        Effect.runPromise(update(dispatch, 'nom'));

        sync.send({
          type: 'synced',
        });
      }
    });

    sync.start();

    return {
      install(app: App) {
        app.provide('sync', sync);
      },
    };
  });

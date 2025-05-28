import { setup, createActor } from 'xstate';
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
import { metaStore } from './meta.store';

export const beaconPulse = ref(0);

// This is the typescript type for the initial values that the sheet will use when it starts.
export type InitValues = {
  id: string;
  character: Character;
  settings: Settings;
  compendiumDrop: CompendiumDragDropData | null;
};

// Almost everything below here is Boilerplate and you probably want to keep it intact.
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
    char.character.attributes.updateId = sheetId.value;
    dispatch.updateCharacter(char as UpdateArgs);
  });

export type SyncActor = ActorRefFrom<typeof machine>;
const machine = (dispatch: Dispatch) =>
  setup({
    types: {
      context: {} as {
        character: any;
        dispatch: Dispatch;
        updateId: string;
      },
      events: {} as
        | { type: 'initialised' }
        | { type: 'update' }
        | { type: 'synced' }
        | { type: 'hydrated' },
    },
    actions: {
      hydrate: function ({ context, event }, params) {
        // Add your action code here
        // ...
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
      dispatch: dispatch,
    },
    id: 'Syncing',
    initial: 'initialising',
    states: {
      initialising: {
        on: {
          initialised: {
            target: 'waiting',
          },
        },
      },
      waiting: {
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
      hydrating: {
        on: {
          hydrated: {
            target: 'waiting',
          },
        },
      },
    },
  });

export const syncPlugin = (dispatch: Dispatch) =>
  Effect.gen(function* () {
    const syncActor = createActor(machine(dispatch));
    syncActor.subscribe(async (snapshot) => {
      console.log('syncActor: snapshot', snapshot);

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
        const characterId = initValues.character.id;
        const { attributes, ...profile } = dispatch.characters[characterId];
        if (attributes.updateId === sheetId.value) {
          return;
        }
        console.log(attributes, profile);
        // store.hydrateStore(attributes, profile);
        syncActor.send({
          type: 'initialised',
        });
      }

      if (snapshot.value === 'syncing') {
        Effect.runPromise(update(dispatch, 'nom')).then(() => {
          console.log('synced');
          syncActor.send({
            type: 'synced',
          });
        });
      }

      if (snapshot.value === 'hydrating') {
        watch(beaconPulse, async (newValue, oldValue) => {
          const characterId = initValues.character.id;
          const { attributes, ...profile } = dispatch.characters[characterId];
          if (attributes.updateId === sheetId.value) {
            return;
          }
          // store.hydrateStore(attributes, profile);
          await nextTick();
        });
      }
    });

    syncActor.start();

    return {
      install(app: App) {
        app.provide('sync', syncActor);
      },
    };
  });

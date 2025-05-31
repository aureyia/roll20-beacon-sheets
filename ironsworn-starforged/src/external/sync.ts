import { setup, createActor, assertEvent } from 'xstate';
import { Effect, Layer } from 'effect';
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
import { DehydrateMetaLive } from '@/external/store';
import { DehydrateCharacterLive } from '@/system/character/store';
import { DehydrateAssetsLive } from '@/system/assets/store';
import { DehydrateStatsLive } from '@/system/stats/store';
import { DehydrateResourcesLive } from '@/system/resources/store';
import { DehydrateMomentumLive } from '@/system/momentum/store';
import { DehydrateImpactsLive } from '@/system/impacts/store';
import { DehydrateSettingsLive } from '@/system/settings/store';
import { DehydrateTasksLive } from '@/system/tasks/store';

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

const DehydrationServicesLive = Layer.mergeAll(
  DehydrateMetaLive,
  DehydrateCharacterLive,
  DehydrateAssetsLive,
  DehydrateStatsLive,
  DehydrateResourcesLive,
  DehydrateMomentumLive,
  DehydrateImpactsLive,
  DehydrateSettingsLive,
  DehydrateTasksLive,
);

const MainLive = DehydrationLive.pipe(Layer.provide(DehydrationServicesLive));

const update = (dispatch: Dispatch, data: any) =>
  Effect.gen(function* () {
    const dehydration = yield* Dehydration;
    const character: Record<string, any> = {};

    character.character.attributes = yield* dehydration.dehydrateStores();
    character.character.attributes.updateId = sheetId.value;
    dispatch.updateCharacter(character as UpdateArgs);
  }).pipe(Effect.provide(MainLive));

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

        console.log(initValues)
        console.log(attributes)

        Effect.runPromise(
          Effect.gen(function* () {
            const hydration = yield* Hydration;

            return hydration.hydrateStores(attributes, profile);
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

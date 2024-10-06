import {
  initRelay,
  type Character,
  type CompendiumDragDropData,
  type Dispatch,
  type Settings,
  type UpdateArgs,
} from '@roll20-official/beacon-sdk';
import { debounce } from 'lodash';
import type { PiniaPluginContext } from 'pinia';

import {
  onInit,
  onChange,
  onSettingsChange,
  onSharedSettingsChange,
  onTranslationsRequest,
  onDragOver,
} from './handlers/handlers';
import { reactive, ref, watch, nextTick, type Ref, type App, shallowRef } from 'vue';
import { createId } from '@paralleldrive/cuid2';

const relayConfig = {
  handlers: {
    onInit,
    onChange,
    onSettingsChange,
    onSharedSettingsChange,
    onTranslationsRequest,
    onDragOver,
  }
};

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

/*
We use refs to keep track of the state of the sheet.
This is a way to keep track of the state of the sheet in a reactive way.
*/
export const beaconPulse = ref(0);
export const blockUpdate = ref(false);
export const dispatchRef = shallowRef();
export const dropUpdate: Ref<Dispatch> = ref({} as Dispatch);
export const settingsSheet = ref(false);
const sheetId = ref(createId());

/*
This is the function that is called when the character data is updated.
logMode is a flag that can be used to log the updates to the console. This is useful for debugging.
*/
const doUpdate = (dispatch: Dispatch, update: Record<string, any>, logMode = false) => {
  if (logMode) console.info('➡️ starforged: Updating Firebase');
  if (logMode) console.dir(`Firebase Update: ${initValues.character.id}`, update);
  const character: Record<string, any> = {
    character: {
      id: initValues.character.id,
      ...update,
    },
  };
  character.character.attributes.updateId = sheetId.value;
  dispatch.updateCharacter(character as UpdateArgs);
};

// This is a debounced version of the update function that will only be called after 800ms of inactivity.
const debounceUpdate = debounce(doUpdate, 800);

/* 
Dev relay is used to run the sheet in a web browser
It will log the updates to the console instead of sending them to the VTT or Roll20/Characters
This is useful for testing the sheet without having to connect to the server.
*/
const devRelay = async () =>
  ({
    update: (...args: any[]) => console.log('devRelay update', args),
    updateCharacter: (...args: any[]) => console.log('devRelay updateCharacter', args),
    characters: {},
    updateTokensByCharacter: () => '',
  }) as any as Dispatch;

/*
This function is called to create the relay.
It will return the relayPinia and relayVue objects that can be used to install the relay in the sheet.
  RelayPinia is used to hydrate the store and watch for changes.
  RelayVue is used to provide the dispatch object from the Beacon SDK to the sheet.
We use a watcher of beaconPulse value to trigger a re-render of the sheet when the value changes, see the onChange handler.
This is just one way to trigger a re-render, you can implement your own logic to trigger a re-render.
*/
export const createRelay = async ({
  devMode = false,
  primaryStore = 'starforgedSheetStore',
  logMode = false,
}) => {
  // @ts-ignore
  const dispatch = await (devMode ? devRelay() : initRelay(relayConfig));
  const relayPinia = (context: PiniaPluginContext) => {
    if (context.store.$id !== primaryStore) return;
    const store = context.store;

    dispatchRef.value = dispatch;

    // Init Store
    const { attributes, ...profile } = initValues.character;
    store.hydrateStore(attributes, profile);

    // Beacon Provides access to settings, like campaign id for example
    store.setCampaignId(initValues.settings.campaignId);
    store.setPermissions(initValues.settings.owned, initValues.settings.gm);

    // Watch for changes
    store.$subscribe(() => {
      if (blockUpdate.value === true) return;
      const update = store.dehydrateStore();
      debounceUpdate(dispatch, update, logMode);
    });

    // Watch for changes from the Beacon SDK, triggered everytime the Beacon Pulse value changes
    watch(beaconPulse, async (newValue, oldValue) => {
      if (logMode) console.log('❤️ Beacon Pulse', { newValue, oldValue });
      const characterId = initValues.character.id;
      blockUpdate.value = true;
      if (logMode) console.log('🔒🔴 locking changes');
      const { attributes, ...profile } = dispatch.characters[characterId];
      if (attributes.updateId === sheetId.value) {
        blockUpdate.value = false;
        return;
      }
      store.hydrateStore(attributes, profile);
      await nextTick();
      if (logMode) console.log('🔓🟢 unlocking changes');
      blockUpdate.value = false;
    });

    return {
      ...dispatch,
    };
  };

  const relayVue = {
    install(app: App) {
      app.provide('dispatch', dispatch);
    },
  };

  return {
    relayPinia,
    relayVue,
  };
};

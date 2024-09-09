import { defineStore } from 'pinia';
import { ref } from 'vue';
import jp from 'jsonpath';
import { useMetaStore, type MetaHydrate } from '@/sheet/stores/meta/metaStore';
import { useCharacterStore } from '@/sheet/stores/character/characterStore';
import { useStatsStore } from '@/sheet/stores/stats/statsStore';
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';
import { useChronicleStore } from '@/sheet/stores/chronicle/chronicleStore';
import { useSettingsStore } from '@/sheet/stores/settings/settingsStore';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';

/*
 * This is the master store for the entire character sheet.
 * This has access to all fields from all the other stores.
 * It is in charge of combining all data in 1 big object to sync it with Firebase.
 * We are listening to changes in this object in other to trigger Dehydrates.
 * Most of this does not need to be changed if you're using Vue.
 * */
export const useStarforgedSheetStore = defineStore('starforgedSheetStore', () => {
  // List all the stores individually.
  const stores = {
    meta: useMetaStore(),
    character: useCharacterStore(),
    stats: useStatsStore(),
    resources: useResourcesStore(),
    impacts: useImpactsStore(),
    chronicle: useChronicleStore(),
    settings: useSettingsStore(),
  };

  const pageLoading = ref(false);

  const storeRegistry = Object.keys(stores) as (keyof typeof stores)[];

  const getValue = (path: string) => {
    const value = jp.value(stores, path);
    return value;
  };

  const setValue = (path: string, newValue: any) => {
    const value = jp.value(stores, path, newValue);
    return value;
  };

  const doAction = (path: string, payload: Record<string, any>) => {
    const func = jp.value(stores, path);
    if (typeof func === 'function') func(payload, stores);
  };

  // Loops through all the stores and runs their Dehydrate.
  // Meta store has unique behavior which shouldn't be modified.
  // This is invoked any time Firebase data changes.
  const dehydrateStore = () => {
    const character: Record<string, any> = {};
    character.attributes = {};
    const storeKeys = Object.keys(stores) as (keyof typeof stores)[];
    storeKeys.forEach((key) => {
      //if (key === "rolls") return;
      if (key === 'meta') {
        const { name, bio, gmNotes, avatar } = stores.meta.dehydrate();
        character.name = name;
        character.bio = bio;
        character.gmNotes = gmNotes;
        character.avatar = avatar;
      } else {
        character.attributes[key] = stores[key].dehydrate();
      }
    });
    return character;
  };

  // Loops through all stores and runs Hydrate.
  // Invoked every time anything in this sheet is updated.
  const hydrateStore = (partial: Record<string, any>, meta: MetaHydrate) => {
    if (partial) {
      storeRegistry.forEach((store) => {
        if (!partial[store]) return;
        //if (store === "rolls") return;
        stores[store].hydrate(partial[store]);
      });
    }
    if (meta) {
      stores.meta.hydrate(meta);
    }
  };

  const setPermissions = (owned: boolean, gm: boolean) => {
    stores.meta.permissions.isOwner = owned;
    stores.meta.permissions.isGM = gm;
  };
  const setCampaignId = (campaignId?: number) => {
    stores.meta.campaignId = campaignId;
  };

  // /*
  // DEV METHOD used to fill the sheet with a lot of data without affecting how the stores are initialized.
  // * Can invoke it from a button in the Settings tab.
  // * */
  const loadExampleData = () => {
    stores.meta.name = 'Auri';
    stores.meta.avatar = 'http://placekitten.com/200/200';
    stores.character.callsign = 'Swifty'
    stores.character.pronouns = 'She/Her'
    stores.resources.health = 5;
    stores.resources.spirit = 5;
    stores.resources.supply = 5;
    stores.resources.xp = 0;
    stores.resources.spentXp = 0;
  };

  return {
    ...stores,
    storeRegistry,
    getValue,
    setValue,
    doAction,
    dehydrateStore,
    hydrateStore,
    setPermissions,
    setCampaignId,
    pageLoading,
    loadExampleData,
  };
});

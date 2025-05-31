import type { App } from "vue";
import { Effect } from "effect";

import { metaStore } from "./store";
import { characterStore } from "@/system/character/store";
import { resourcesStore } from "@/system/resources/store";
import { impactsStore } from "@/system/impacts/store";
import { momentumStore } from "@/system/momentum/store";
import { assetsStore } from "@/system/assets/store";
import { statsStore } from "@/system/stats/store";
import { tasksStore } from "@/system/tasks/store";
import { settingsStore } from "@/system/settings/store";

export const busPlugin = (sync: any) =>
  Effect.gen(function* () {
    const nom = () => {
      return true
    }
      console.log('bus started')

      const update = (snapshot) => {
        console.log('snapshot', snapshot)
        sync.send({ type: 'update' })
      }

      metaStore.on('set', update)
      characterStore.on('set', update)
      resourcesStore.on('set', update)
      resourcesStore.on('increase', update)
      resourcesStore.on('decrease', update)
      impactsStore.on('add', update)
      impactsStore.on('remove', update)
      momentumStore.on('set', update)
      assetsStore.on('add', update)
      assetsStore.on('remove', update)
      assetsStore.on('clear', update)
      statsStore.on('set', update)
      tasksStore.on('add', update)
      tasksStore.on('remove', update)
      tasksStore.on('set', update)
      settingsStore.on('set', update)   

    return {
      install(app: App) {
        app.provide('bus', nom);
      },
    };
  });
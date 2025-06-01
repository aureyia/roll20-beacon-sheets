import { effect, type App } from 'vue';
import { Stream, Queue, Effect } from 'effect';
import { sync } from '@/external/sync';

import { metaStore } from './store';
import { characterStore } from '@/system/character/store';
import { resourcesStore } from '@/system/resources/store';
import { impactsStore } from '@/system/impacts/store';
import { momentumStore } from '@/system/momentum/store';
import { assetsStore } from '@/system/assets/store';
import { statsStore } from '@/system/stats/store';
import { tasksStore } from '@/system/tasks/store';
import { settingsStore } from '@/system/settings/store';

export const busPlugin = () => {
  const dummyFn = () => {};

  let updateBlocked = false;

  const update = (store: string) =>
    Effect.gen(function* () {
      if (updateBlocked) return;

      updateBlocked = true;
      yield* Effect.sleep('800 millis');
      sync.send({ type: 'update' });
      console.log('Event Bus: Update Sent');
      updateBlocked = false;
    });

  metaStore.on('updated', () => Effect.runPromise(update('meta')));
  characterStore.on('updated', () => Effect.runPromise(update('character')));
  resourcesStore.on('updated', () => Effect.runPromise(update('resources')));
  impactsStore.on('updated', () => Effect.runPromise(update('impacts')));
  momentumStore.on('updated', () => Effect.runPromise(update('momentum')));
  assetsStore.on('updated', () => Effect.runPromise(update('assets')));
  statsStore.on('updated', () => Effect.runPromise(update('stats')));
  tasksStore.on('updated', () => Effect.runPromise(update('tasks')));
  settingsStore.on('updated', () => Effect.runPromise(update('settings')));

  console.log('Event Bus: Initialised');

  return {
    install(app: App) {
      app.provide('bus', dummyFn);
    },
  };
};

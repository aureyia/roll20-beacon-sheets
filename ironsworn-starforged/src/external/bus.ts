import type { App } from 'vue';
import { Stream, Queue, Effect, Runtime } from 'effect';
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
  const eventBus = Effect.gen(function* () {
    const queue = yield* Queue.bounded<string>(100);

    const update = () =>
      Effect.gen(function* () {
        sync.send({ type: 'update' });
        console.log('Event Bus: Update Sent');
      });

    metaStore.on('updated', () => Queue.offer(queue, 'meta'));
    characterStore.on('updated', () => Queue.offer(queue, 'character'));
    resourcesStore.on('updated', () => Queue.offer(queue, 'resources'));
    impactsStore.on('updated', () => Queue.offer(queue, 'impacts'));
    momentumStore.on('updated', () => Queue.offer(queue, 'momentum'));
    assetsStore.on('updated', () => Queue.offer(queue, 'assets'));
    statsStore.on('updated', () => Queue.offer(queue, 'stats'));
    tasksStore.on('updated', () => Queue.offer(queue, 'tasks'));
    settingsStore.on('updated', () => Queue.offer(queue, 'settings'));

    const stream = Stream.fromQueue(queue).pipe(
      Stream.debounce('800 millis'),
      Stream.tap(() => update()),
    );

    console.log('Event Bus: Initialised');

    yield* stream.pipe(Stream.runDrain);
  });

  Effect.runPromise(eventBus);
  // Effect.runFork(eventBus)

  return {
    install(app: App) {
      app.provide('bus', dummyFn);
    },
  };
};

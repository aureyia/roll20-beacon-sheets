import { Stream, Queue, Effect, Config, Duration } from 'effect';
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

export const storeRelay = Effect.gen(function* () {
  const queue = yield* Queue.bounded<string>(20);

  const update = () =>
    Effect.gen(function* () {
      yield* Queue.offer(queue, 'update');
    });

  metaStore.on('updated', () => Effect.runPromise(update()));
  characterStore.on('updated', () => Effect.runPromise(update()));
  resourcesStore.on('updated', () => Effect.runPromise(update()));
  impactsStore.on('updated', () => Effect.runPromise(update()));
  momentumStore.on('updated', () => Effect.runPromise(update()));
  assetsStore.on('updated', () => Effect.runPromise(update()));
  statsStore.on('updated', () => Effect.runPromise(update()));
  tasksStore.on('updated', () => Effect.runPromise(update()));
  settingsStore.on('updated', () => Effect.runPromise(update()));

  const debouceTime = Number(import.meta.env.VITE_DEBOUNCE) || 800;

  const stream = Stream.fromQueue(queue).pipe(
    Stream.debounce(Duration.millis(debouceTime)),
  );

  yield* Stream.runForEach(stream, () =>
    Effect.sync(() => sync.send({ type: 'update' })),
  );

  console.log('Store Relay: Initialised');
});

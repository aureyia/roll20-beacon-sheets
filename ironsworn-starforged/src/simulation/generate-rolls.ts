import { Effect, Layer, Stream, Schedule } from 'effect';
import { momentumStore } from '@/system/momentum/store';
import { roll as actionRoll } from '@/system/rolls/handlers/action-roll';
import { roll as progressRoll } from '@/system/rolls/handlers/progress-roll';
import { roll as oracleRoll } from '@/system/rolls/handlers/oracle-roll';
import { machine } from '@/system/rolls/machines/calculate-outcome';
import { createAtom } from '@xstate/store';
import { createActor } from 'xstate';
import { RollFormatterLive } from '@/system/rolls/formatter';
import { DispatchLive } from '@/system/rolls/dispatch';
import { ActionRollLive } from '@/system/rolls/handlers/action-roll';
import { ActionScoreLive } from '@/system/rolls/action-score';
import { createId } from '@paralleldrive/cuid2';
import { numberBetween } from './prng';
import { ref } from 'vue';
import { statsStore, type Stats } from '@/system/stats/store';
import { resourcesStore } from '@/system/resources/store';
import { intensity } from '@/main';
import { resources, stats, impacts, assets, tasks } from './fuzzers/stores';
import { impactsStore } from '@/system/impacts/store';
import { tasksStore } from '@/system/tasks/store';
import { assetsStore } from '@/system/assets/store';

const FormatAndRollLive = RollFormatterLive.pipe(Layer.provide(DispatchLive));
const MainLive = ActionRollLive.pipe(
  Layer.provide(FormatAndRollLive),
  Layer.provide(ActionScoreLive),
);

const actor = createActor(machine);

actor.subscribe((snapshot) => {
  const matched =
    // @ts-ignore
    snapshot.matches('Eligible for Opportunity') ||
    // @ts-ignore
    snapshot.matches('Hitting: Eligible for Strong Hit') ||
    // @ts-ignore
    snapshot.matches('Missing: Eligible for Strong Hit') ||
    // @ts-ignore
    snapshot.matches('Eligible for Weak Hit');

  if (matched) {
    const choice =
      Effect.runSync(numberBetween(seed.get(), 'choice', 0, 1)) > 0;
    actor.send({
      type: 'burnChoice',
      value: choice,
    });
  }
});

const moveData = { Name: 'Simulation Rolls' };
export let seed = createAtom('');
export const replaySeed = ref('');
export const createSeed = () =>
  replaySeed.value !== '' ? replaySeed.value : createId();

const modifier = () =>
  Effect.runSync(numberBetween(seed.get(), 'modifier', 0, 4));

export const rollSteam = (speed: number) => {
  const streamInit = Schedule.spaced(`${speed} millis`);
  return Stream.fromSchedule(streamInit).pipe(
    Stream.tap(() =>
      Effect.sync(() => {
        seed.set(createSeed());
        console.log('seed', seed.get());
      }),
    ),
    Stream.tap(() => {
      return Effect.sync(() => {
        impactsStore.trigger.clear();
        tasksStore.trigger.clear();
        assetsStore.trigger.clear();

        momentumStore.trigger.set({
          value: Effect.runSync(numberBetween(seed.get(), 'momentum', -6, 10)),
        });

        ['edge', 'heart', 'iron', 'shadow', 'wits'].forEach((stat: string) => {
          statsStore.trigger.set({
            // @ts-ignore
            label: stat,
            // @ts-ignore
            value: stats(seed.get(), intensity.value)[stat],
          });
        });

        ['health', 'spirit', 'supply', 'xp'].forEach((resource: string) => {
          resourcesStore.trigger.set({
            // @ts-ignore
            label: resource,
            // @ts-ignore
            value: resources(seed.get(), intensity.value)[resource],
          });
        });

        [
          'misfortunes',
          'lastingEffects',
          'burdens',
          'currentVehicle',
          'other',
        ].forEach((name: string) => {
          impactsStore.trigger.set({
            // @ts-ignore
            label: name,
            // @ts-ignore
            value: impacts(seed.get(), intensity.value)[name],
          });
        });

        // tasksStore.trigger.set();
        // assetsStore.trigger.set();
      });
    }),
    Stream.runForEach((n) =>
      actionRoll(
        actor,
        modifier(),
        momentumStore.get().context.momentum,
        moveData.Name,
      ).pipe(Effect.provide(MainLive)),
    ),
  );
};

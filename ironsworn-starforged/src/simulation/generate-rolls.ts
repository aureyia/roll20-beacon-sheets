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
import { statsStore } from '@/system/stats/store';
import { resourcesStore } from '@/system/resources/store';

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
    console.log('matched');
    const choice =
      Effect.runSync(numberBetween(seed.get(), 'choice', 0, 1)) > 0;
    console.log('choice', choice);
    actor.send({
      type: 'burnChoice',
      value: choice,
    });
  }
});

const moveData = { Name: 'Simulation Rolls' };
export let seed = createAtom(createId());
const modifier = () =>
  Effect.runSync(numberBetween(seed.get(), createId(), 0, 4));

const stats = () => ({
  edge: Effect.runSync(numberBetween(seed.get(), 'edge', 1, 5)),
  heart: Effect.runSync(numberBetween(seed.get(), 'heart', 1, 5)),
  iron: Effect.runSync(numberBetween(seed.get(), 'iron', 1, 5)),
  shadow: Effect.runSync(numberBetween(seed.get(), 'shadow', 1, 5)),
  wits: Effect.runSync(numberBetween(seed.get(), 'wits', 1, 5)),
});

const resources = () => ({
  health: Effect.runSync(numberBetween(seed.get(), 'health', 0, 5)),
  spirit: Effect.runSync(numberBetween(seed.get(), 'spirit', 0, 5)),
  supply: Effect.runSync(numberBetween(seed.get(), 'supply', 0, 5)),
  xp: Effect.runSync(numberBetween(seed.get(), 'xp', 0, 10)),
});

export const rollSteam = (speed: number) => {
  const streamInit = Schedule.spaced(`${speed} millis`);
  return Stream.fromSchedule(streamInit).pipe(
    Stream.tap(() =>
      Effect.sync(() => {
        seed.set(createId());
        console.log('seed', seed.get());
      }),
    ),
    Stream.tap(() => {
      return Effect.sync(() => {
        const momentum = Effect.runSync(
          numberBetween(seed.get(), 'momentum', -6, 10),
        );
        momentumStore.trigger.set({ value: momentum });
        statsStore.trigger.set({ label: 'edge', value: stats().edge });
        statsStore.trigger.set({ label: 'heart', value: stats().heart });
        statsStore.trigger.set({ label: 'iron', value: stats().iron });
        statsStore.trigger.set({ label: 'shadow', value: stats().shadow });
        statsStore.trigger.set({ label: 'wits', value: stats().wits });
        resourcesStore.trigger.set({
          label: 'health',
          value: resources().health,
        });
        resourcesStore.trigger.set({
          label: 'spirit',
          value: resources().spirit,
        });
        resourcesStore.trigger.set({
          label: 'supply',
          value: resources().supply,
        });
        resourcesStore.trigger.set({ label: 'xp', value: resources().xp });
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

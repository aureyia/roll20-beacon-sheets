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
import { ref } from 'vue';

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
    actor.send({
      type: 'burnChoice',
      value: true,
    });
  }
});

const moveData = { Name: 'Name' };
const modifier = 2;
export let seed = createAtom(createId());

const streamInit = Schedule.spaced('500 millis');
export const rollSteam = Stream.fromSchedule(streamInit).pipe(
  Stream.tap(() => Effect.sync(() => { seed.set(createId()); console.log('seed', seed.get())})),
  Stream.runForEach((n) =>
    actionRoll(
      actor,
      modifier,
      momentumStore.get().context.momentum,
      moveData.Name,
    ).pipe(Effect.provide(MainLive)),
  ),
);

import { Effect, Layer, Stream, Schedule } from 'effect';
import { momentumStore } from '@/system/momentum/store';
import { roll as actionRoll } from '@/system/rolls/handlers/action-roll';
import { roll as progressRoll } from '@/system/rolls/handlers/progress-roll';
import { roll as oracleRoll } from '@/system/rolls/handlers/oracle-roll';
import { machine } from '@/system/rolls/machines/calculate-outcome';
import { createActor } from 'xstate';
import { RollFormatterLive } from '@/system/rolls/formatter';
import { DispatchLive } from '@/system/rolls/dispatch';
import { ActionRollLive } from '@/system/rolls/handlers/action-roll';
import { ActionScoreLive } from '@/system/rolls/action-score';

const FormatAndRollLive = RollFormatterLive.pipe(Layer.provide(DispatchLive));
const MainLive = ActionRollLive.pipe(
  Layer.provide(FormatAndRollLive),
  Layer.provide(ActionScoreLive),
);

const actor = createActor(machine);

actor.subscribe((snapshot) => {
  const matched =
    snapshot.matches('Eligible for Opportunity') ||
    snapshot.matches('Hitting: Eligible for Strong Hit') ||
    snapshot.matches('Missing: Eligible for Strong Hit') ||
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
const momentum = momentumStore.get().context.momentum;

const streamInit = Schedule.spaced('1000 millis');
export const rollSteam = Stream.fromSchedule(streamInit).pipe(
  Stream.runForEach((n) =>
    actionRoll(actor, modifier, momentum, moveData.Name).pipe(
      Effect.provide(MainLive),
    ),
  ),
);

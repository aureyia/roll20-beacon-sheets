import { RollOutcome, RollOutcomeLive } from '@/system/rolls/roll-outcome';
import { ActionScore, ActionScoreLive } from '@/system/rolls/action-score';
import { Beacon, BeaconLive } from '@/system/rolls/beacon';
import { Effect, Context, Layer, Schedule, Console, pipe } from 'effect';
import { actionDice } from '@/system/rolls/dice';
import { getDieByLabel } from '@/system/rolls/get-die-by-label';

type ActionRollResult = {
  outcome: string;
  score: number;
  modifier: number;
  actionDie: {
    roll: number;
  };
  challengeDie1: {
    roll: number;
    exceeded: boolean;
  };
  challengeDie2: {
    roll: number;
    exceeded: boolean;
  };
};

class ActionRollHandler extends Context.Tag('ActionRollHandler')<
  ActionRollHandler,
  {
    readonly roll: (modifier: number) => Effect.Effect<ActionRollResult, Error>;
  }
>() {}

const ActionRollHandlerLive = Layer.effect(
  ActionRollHandler,
  Effect.gen(function* () {
    const beacon = yield* Beacon;
    const rollOutcome = yield* RollOutcome;
    const actionScore = yield* ActionScore;

    return {
      roll: (modifier: number) =>
        Effect.gen(function* () {
          const rolledDice = yield* beacon.roll(actionDice);

          const totalActionScore = yield* actionScore.calculate(
            rolledDice,
            modifier,
            null,
          );
          const challengeDie1 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 1',
          );
          const challengeDie2 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 2',
          );
          const actionDie = yield* getDieByLabel(rolledDice, 'Action Die');
          const outcome = yield* rollOutcome.calculate(
            totalActionScore,
            challengeDie1,
            challengeDie2,
          );

          return {
            outcome: outcome.outcome,
            score: totalActionScore,
            modifier: modifier,
            actionDie: {
              roll: actionDie.value,
            },
            challengeDie1: {
              roll: outcome.challengeDie1.value,
              exceeded: outcome.challengeDie1.exceeded,
            },
            challengeDie2: {
              roll: outcome.challengeDie2.value,
              exceeded: outcome.challengeDie2.exceeded,
            },
          };
        }),
    };
  }),
);

const MainLive = ActionRollHandlerLive.pipe(
  Layer.provide(BeaconLive),
  Layer.provide(ActionScoreLive),
  Layer.provide(RollOutcomeLive),
);

export const roll = (score: number) =>
  Effect.provide(
    Effect.flatMap(ActionRollHandler, (handler) => handler.roll(score)),
    MainLive,
  );

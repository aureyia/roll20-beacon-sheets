import type { DiceComponent } from '@/internal/rolls/application/rolltemplates/rolltemplates';
import { RollOutcome, RollOutcomeLive } from '../application/roll-outcome';
import { ActionScore, ActionScoreLive } from '../application/action-score';
import { Beacon, BeaconLive } from '../infrastructure/beacon';
import { Effect, Context, Layer, Schedule, Console } from 'effect';
import { actionDice } from '@/internal/rolls/application/dice';
import { getDieByLabel } from '../application/get-die-by-label';

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
          const rolledDice = yield* Effect.promise(() =>
            Effect.runPromise(beacon.roll(actionDice)),
          );
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
          const outcome = Effect.runSync(
            rollOutcome.calculate(
              totalActionScore,
              challengeDie1,
              challengeDie2,
            ),
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

const rollOutput = (score: number) =>
  Effect.gen(function* () {
    const rollHandler = yield* ActionRollHandler;
    return Effect.runPromise(rollHandler.roll(score));
  });

export const roll = (score: number) =>
  Effect.runPromise(Effect.provide(rollOutput(score), MainLive));

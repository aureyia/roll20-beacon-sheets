import {
  ActionScore,
  ActionScoreLive,
  ActionScoreError,
} from '@/system/rolls/action-score';
import {
  RollFormatter,
  InvalidDie,
  RollFormatterLive,
  InvalidDispatch,
} from '@/system/rolls/formatter';
import { Effect, Context, Layer, Either, Predicate } from 'effect';
import { actionDice } from '@/system/rolls/dice';
import { getDieByLabel, DieNotFound } from '@/system/rolls/get-die-by-label';
import { type OutcomeActor } from '@/system/rolls/machines/calculate-outcome';
import { initValues } from '@/external/sync';
import { DispatchError, DispatchLive } from '@/system/rolls/dispatch';
import { assert } from '@/utility/assert';

export class ActionRoll extends Context.Tag('ActionRoll')<
  ActionRoll,
  {
    readonly roll: (
      actor: OutcomeActor,
      modifier: number,
      momentum: number,
      rollName: string,
    ) => Effect.Effect<
      void,
      | ActionScoreError
      | InvalidDie
      | DieNotFound
      | DispatchError
      | InvalidDispatch
    >;
  }
>() {}

export const ActionRollLive = Layer.effect(
  ActionRoll,
  Effect.gen(function* () {
    const formatter = yield* RollFormatter;
    const actionScore = yield* ActionScore;

    return {
      roll: (actor, modifier, momentum, rollName) =>
        Effect.gen(function* () {
          assert(initValues.character.id !== undefined);

          const rolledDice = yield* formatter.roll(actionDice);
          const totalActionScore = yield* actionScore.calculate(
            rolledDice,
            modifier,
            momentum,
            null,
          );

          const { challengeDie1, challengeDie2, actionDie } = yield* Effect.all(
            {
              challengeDie1: getDieByLabel(rolledDice, 'Challenge Die: 1'),
              challengeDie2: getDieByLabel(rolledDice, 'Challenge Die: 2'),
              actionDie: getDieByLabel(rolledDice, 'Action Die'),
            },
          );

          assert(
            challengeDie1.value > 0 &&
              challengeDie2.value > 0 &&
              actionDie.value > 0,
          );
          actor.start();
          actor.send({
            type: 'params',
            value: {
              name: rollName,
              character: {
                name: initValues.character.name,
                id: initValues.character.id,
              },
              challengeDie1: challengeDie1.value,
              challengeDie2: challengeDie2.value,
              actionDie: {
                value: actionDie.value,
                negated: false,
              },
              actionScore: totalActionScore,
              momentum: momentum,
            },
          });
        }),
    };
  }),
);

const FormatAndRollLive = RollFormatterLive.pipe(Layer.provide(DispatchLive));
const MainLive = ActionRollLive.pipe(
  Layer.provide(FormatAndRollLive),
  Layer.provide(ActionScoreLive),
);

export const roll = (
  actor: OutcomeActor,
  modifier: number,
  momentum: number,
  rollName: string,
) =>
  Effect.provide(
    Effect.flatMap(ActionRoll, (actionRoll) =>
      actionRoll.roll(actor, modifier, momentum, rollName),
    ),
    MainLive,
  );

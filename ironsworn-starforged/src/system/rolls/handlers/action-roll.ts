import {
  ActionScore,
  ActionScoreError,
} from '@/system/rolls/action-score';
import {
  RollFormatter,
  InvalidDie,
  InvalidDispatch,
} from '@/system/rolls/formatter';
import { Effect, Context, Layer } from 'effect';
import { actionDice } from '@/system/rolls/dice';
import { getDieByLabel, DieNotFound } from '@/system/rolls/get-die-by-label';
import { type OutcomeActor } from '@/system/rolls/machines/calculate-outcome';
import { initValues } from '@/external/sync';
import { DispatchError, Dispatch } from '@/system/rolls/dispatch';
import { assert } from '@/utility/assert';
import type { ParseError } from 'effect/ParseResult';
import { Console } from 'effect';

// # Dependency Injection 2
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
      | ParseError
    >;
  }
>() {}

// Layer.Layer<ActionRoll, never, ActionScore | RollFormatter | Dispatch>
export const ActionRollLive = Layer.effect(
  ActionRoll,
  //@ts-ignore for now
  Effect.gen(function* () {
    const formatter = yield* RollFormatter;
    const dispatch = yield* Dispatch;
    const actionScore = yield* ActionScore;

    return {
      roll: (actor, modifier, momentum, rollName) =>
        Effect.gen(function* () {
          assert(initValues.character.id !== undefined);

          const encodedDice = yield* formatter.toDispatch(actionDice);

          const output = yield* Effect.retry(dispatch.roll(encodedDice), {
            times: 3,
          });

          const decodedDice = yield* formatter.fromDispatch(
            output,
            encodedDice,
            actionDice,
          );

          const { totalActionScore, dieNegated } = yield* actionScore.calculate(
            decodedDice,
            modifier,
            momentum,
            null,
          );

          const { challengeDie1, challengeDie2, actionDie } = yield* Effect.all(
            {
              challengeDie1: getDieByLabel(decodedDice, 'Challenge Die: 1'),
              challengeDie2: getDieByLabel(decodedDice, 'Challenge Die: 2'),
              actionDie: getDieByLabel(decodedDice, 'Action Die'),
            },
          );

          assert(
            challengeDie1.value > 0 &&
              challengeDie2.value > 0 &&
              actionDie.value > 0,
          );

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
                negated: dieNegated,
              },
              actionScore: totalActionScore,
              momentum: momentum,
            },
          });
        }),
    };
  }),
);

// # Error Handling 3
export const roll = (
  actor: OutcomeActor,
  modifier: number,
  momentum: number,
  rollName: string,
) =>
  Effect.flatMap(ActionRoll, (actionRoll) =>
    actionRoll.roll(actor, modifier, momentum, rollName),
  ).pipe(
    Effect.catchTags({
      ActionScoreError: () => Console.warn('ActionScore Error'),
      InvalidDie: () => Console.warn('InvalidDie Error'),
      DieNotFound: () => Console.warn('DieNotFound Error'),
      DispatchError: () => Console.warn('Dispatch Error'),
      InvalidDispatch: () => Console.warn('InvalidDispatch Error'),
      ParseError: () => Console.warn('Parse Error'),
    }),
  );

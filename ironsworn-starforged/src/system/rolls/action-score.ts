import { Effect, Context, Layer, Data } from 'effect';
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';

export class ActionScoreError extends Data.TaggedError('ActionScoreError')<{
  cause?: unknown;
  message?: string;
}> {}

export class ActionScore extends Context.Tag('ActionScore')<
  ActionScore,
  {
    readonly calculate: (
      dice: DiceComponent[],
      modifier: number,
      momentum: number,
      presetActionScore: number | null,
    ) => Effect.Effect<
      { totalActionScore: number; dieNegated: boolean },
      ActionScoreError
    >;
  }
>() {}

export const ActionScoreLive = Layer.effect(
  ActionScore,
  Effect.gen(function* () {
    return {
      calculate: (
        dice: DiceComponent[],
        modifier: number,
        momentum: number,
        presetActionScore: number | null = null,
      ) => {
        if (presetActionScore !== null) {
          return Effect.succeed({
            totalActionScore: presetActionScore,
            dieNegated: false,
          });
        }

        const actionDieResult = dice.find((die) => die.label === 'Action Die');

        if (!actionDieResult) {
          return Effect.fail(
            new ActionScoreError({
              message: 'actionDieResult value is undefined',
            }),
          );
        }

        if (!actionDieResult.value) {
          return Effect.fail(
            new ActionScoreError({ message: 'actionDieResult has no value' }),
          );
        }

        const isDieNegated = actionDieResult.value === -momentum;
        const finalisedActionScore =
          (isDieNegated ? 0 : actionDieResult.value) + modifier;
        const actionScoreMaximum = 10;
        return Effect.succeed({
          totalActionScore: Math.min(finalisedActionScore, actionScoreMaximum),
          dieNegated: isDieNegated,
        });
      },
    };
  }),
);

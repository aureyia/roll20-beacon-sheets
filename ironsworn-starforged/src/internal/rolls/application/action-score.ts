import { Effect, Context, Layer } from 'effect';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';

export class ActionScore extends Context.Tag('ActionScore')<
  ActionScore,
  {
    readonly calculate: (
      dice: DiceComponent[],
      modifier: number,
      presetActionScore: number | null,
    ) => Effect.Effect<number, Error>;
  }
>() {}

const calculateActionScore = (
  actionDieResult: DiceComponent[],
  modifier: number,
  presetActionScore: number | null = null,
): Effect.Effect<number, Error> => {
  if (presetActionScore !== null) {
    return Effect.succeed(presetActionScore);
  }

  if (actionDieResult.length < 1) {
    return Effect.fail(new Error('actionDieResult is empty'));
  }

  if (!actionDieResult[0].value) {
    return Effect.fail(new Error('actionDieResult value is undefined'));
  }

  return Effect.succeed(Math.min(actionDieResult[0].value + modifier, 10));
};

export const ActionScoreLive = Layer.effect(
  ActionScore,
  Effect.gen(function* () {
    return {
      calculate: calculateActionScore
    }
  })
)
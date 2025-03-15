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
  dice: DiceComponent[],
  modifier: number,
  presetActionScore: number | null = null,
): Effect.Effect<number, Error> => {
  if (presetActionScore !== null) {
    return Effect.succeed(presetActionScore);
  }

  const actionDieResult = dice.find((die) => die.label === 'Action Die');

  if (!actionDieResult) {
    return Effect.fail(new Error('actionDieResult value is undefined'));
  }

  if (!actionDieResult.value) {
    return Effect.fail(new Error('actionDieResult has no value'));
  }

  const actionScoreMaximum = 10;
  return Effect.succeed(
    Math.min(actionDieResult.value + modifier, actionScoreMaximum),
  );
};

export const ActionScoreLive = Layer.effect(
  ActionScore,
  Effect.gen(function* () {
    return {
      calculate: calculateActionScore,
    };
  }),
);

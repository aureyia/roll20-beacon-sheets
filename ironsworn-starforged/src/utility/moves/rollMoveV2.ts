// import { initValues } from '@/relay/relay';
// import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
// import { sendRollToChat } from '@/utility/sendRollToChat';
import { actionDie, challengeDice } from '@/system/rolls/dice';
import { calculateOutcome } from '@/utility/rolls/calculateOutcome';
// import { calculateActionScore } from '@/utility/rolls/calculateActionScore';
// import { isEligibleForMomentumBurn } from '../rolls/momentumEligibility';
import { Effect, Context, Console, pipe } from 'effect';
// import { rollDiceWithBeacon } from '../rolls/rollDiceWithBeacon';
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';
import type { Momentum } from '@/system/momentum/types';
import { floor } from 'lodash';
import { rollDiceWithBeacon } from '../rolls/rollDiceWithBeacon';
import { UnknownException } from 'effect/Cause';

// TODO: Refactor so it doesn't have state called during the function execution.
// Momentum and dice roll
export const moveOptionsCheck = (move: any) => move.Trigger.Options.length > 1;

// export const rollMove = async (value: number, modifier: number, option: any, momentum: number) => {
//   const rolledDice = await Effect.runPromise(rollDiceWithBeacon(actionDice));
//   const actionScore = calculateActionScore(rolledDice, value, modifier, momentum);

//   const { dice, outcome } = Effect.runSync(calculateOutcome(actionScore.score, rolledDice));
//   console.log('dice', dice)
//   console.log('outcome', outcome)
//   const momentumBurn = isEligibleForMomentumBurn(dice, outcome, momentum, option);

//   return { dice, outcome, actionScore, momentumBurn };
// };

export const actionDieResult = (
  presetActionDie: number | null,
): Effect.Effect<DiceComponent[], UnknownException> =>
  presetActionDie !== null
    ? Effect.succeed([{ value: presetActionDie }])
    : rollDiceWithBeacon(actionDie);

export const actionScore = (
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

  return Effect.succeed(floor(actionDieResult[0].value + modifier, 10));
};

export const challengeDiceResult = () =>
  Effect.runPromise(rollDiceWithBeacon(challengeDice));

export const moveRollV2 = async (
  momentum: Momentum,
  modifier: number = 0,
  presetActionDice: number | null = null,
  presetActionScore: number | null = null,
) =>
  pipe(
    presetActionDice,
    actionDieResult,
    Effect.andThen((result) =>
      actionScore(result, modifier, presetActionScore),
    ),
    Effect.andThen(async (score) =>
      Effect.runPromise(calculateOutcome(score, await challengeDiceResult())),
    ),
  );

//   presetActionDice,
//   actionDiceResult,
//   Effect.andThen((result) => actionScore(result, modifier, presetActionScore)),
//   Effect.andThen(async (score) =>
//     Effect.runPromise(calculateOutcome(score, await challengeDiceResult()))
//   )
// )

// export const followUpRoll = async (opts: any) => {
//   await sendRollToChat(initValues.character.id, {
//     type: 'move-compact',
//     parameters: {
//       characterName: initValues.character.name,
//       // TODO: Fix move name not displaying
//       title: 'Rolling ',
//       dice: opts.dice,
//       outcome: opts.outcome,
//       score: opts.actionScore,
//     },
//   });
// };

import { initValues } from '@/external/relay/bootstrap/relay';
import { useResourcesStore } from '@/internal/resources/infrastructure/store';
import { sendRollToChat } from '@/utility/sendRollToChat';
import { actionDice } from '@/internal/rolls/application/dice';
import { calculateOutcome } from '@/utility/rolls/calculateOutcome';
import { calculateActionScore } from '@/utility/rolls/calculateActionScore';
import { isEligibleForMomentumBurn } from '../rolls/momentumEligibility';
import { Effect } from 'effect';
import { rollDiceWithBeacon } from '../rolls/rollDiceWithBeacon';

// TODO: Refactor so it doesn't have state called during the function execution.
// Momentum and dice roll
export const moveOptionsCheck = (move: any) => move.Trigger.Options.length > 1;

export const rollMove = async (
  value: number,
  modifier: number,
  option: any,
  momentum: number,
) => {
  const rolledDice = await Effect.runPromise(rollDiceWithBeacon(actionDice));
  const actionScore = calculateActionScore(
    rolledDice,
    value,
    modifier,
    momentum,
  );

  const { dice, outcome } = Effect.runSync(
    calculateOutcome(actionScore.score, rolledDice),
  );
  console.log('dice', dice);
  console.log('outcome', outcome);
  const momentumBurn = isEligibleForMomentumBurn(
    dice,
    outcome,
    momentum,
    option,
  );

  return { dice, outcome, actionScore, momentumBurn };
};

export const followUpRoll = async (opts: any) => {
  await sendRollToChat(initValues.character.id, {
    type: 'move-compact',
    parameters: {
      characterName: initValues.character.name,
      // TODO: Fix move name not displaying
      title: 'Rolling ',
      dice: opts.dice,
      outcome: opts.outcome,
      score: opts.actionScore,
    },
  });
};

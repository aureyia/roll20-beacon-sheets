import { initValues } from '@/relay/relay';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { sendRollToChat } from '@/utility/sendRollToChat';
import { convertResultsToDice, formatDiceComponents } from '@/utility/convertResultsToDice';
import { getRollFromDispatch } from '@/utility/getRollFromDispatch';
import { actionDice } from '@/system/dice';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { calculateOutcome } from './calculateOutcome';
import { calculateActionScore } from './calculateActionScore';
import { isEligibleForMomentumBurn } from './momentumEligibility';
import { Effect, Context } from 'effect';

// TODO: Refactor so it doesn't have state called during the function execution.
// Momentum and dice roll
export const moveOptionsCheck = (move: any) => move.Trigger.Options.length > 1;

export const rollMove = async (
  move: any,
  assets: any,
  value: number,
  modifier: number,
  option: any,
) => {
  const rolledDice = await getRolledDice(actionDice);
  const { momentum } = useResourcesStore();

  const assetModifiers = calculatePrerollAssetModifiers(assets);

  const actionScore = calculateActionScore(rolledDice, value, modifier + assetModifiers, momentum);
  const { dice, outcome } = Effect.runSync(calculateOutcome(actionScore.score, rolledDice));
  const momentumBurn = isEligibleForMomentumBurn(dice, outcome, momentum, option);
  return { dice, outcome, actionScore, momentumBurn, move };
};

const calculatePrerollAssetModifiers = (assets: any) => 0;

export const followUpRoll = async (opts: any) =>{
  console.log(opts);

  sendRollToChat(initValues.character.id, {
    type: 'move-compact',
    parameters: {
      characterName: initValues.character.name,
      // TODO: Fix move name not displaying  
      title: 'Rolling ' + opts.move.Text,
      dice: opts.dice,
      outcome: opts.outcome,
      score: opts.actionScore,
    },
  });
};

export const getRolledDice = async (dice: DiceComponent[]): Promise<DiceComponent[]> => {
  const formattedDice = formatDiceComponents(dice);
  const rollResults = await getRollFromDispatch({ rolls: formattedDice });
  return convertResultsToDice(dice, rollResults);
};

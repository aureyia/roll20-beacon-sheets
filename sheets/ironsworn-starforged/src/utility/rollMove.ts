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

// TODO: Refactor so it doesn't have state called during the function execution.
// Momentum and dice roll
export const rollMove = async (move: any, assets: any, value: number, modifier: number) => {
  const rolledDice = await getRolledDice(actionDice);
  const { momentum } = useResourcesStore();

  const assetModifiers = calculatePrerollAssetModifiers(assets);

  const actionScore = calculateActionScore(rolledDice, value, modifier + assetModifiers, momentum);
  const { dice, outcome } = calculateOutcome(actionScore.score, rolledDice);
  const momentumBurn = isEligibleForMomentumBurn(dice, outcome, momentum);
  return { dice, outcome, actionScore, momentumBurn, move };
};

const calculatePrerollAssetModifiers = (assets: any) => 0;

export const followUpRoll = async (opts: any) => {
  // console.log(opts)

  sendRollToChat(initValues.character.id, {
    type: 'move-compact',
    parameters: {
      characterName: initValues.character.name,
      title: 'Rolling ' + opts.move.Name,
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

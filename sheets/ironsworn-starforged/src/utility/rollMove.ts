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
import { MoveOutcome } from 'dataforged';

export const actionRoll = async (label: string, value: number, modifier: number) => {
  const { momentum } = useResourcesStore();
  const formattedDice = formatDiceComponents(actionDice);
  const rollResults = await getRollFromDispatch({ rolls: formattedDice });
  const rolledDice = convertResultsToDice(actionDice, rollResults);
  const character = initValues.character;
  sendRollToChat(character.id, {
    type: 'move',
    parameters: {
      characterName: character.name,
      title: 'Rolling ' + label,
      dice: rolledDice,
      label,
      value,
      momentum,
      modifier,
    },
  });
};

// TODO: Refactor so it doesn't have state called during the function execution.
// Momentum and dice roll
export const rollMove = async (move: any, assets: any, value: number, modifier: number) => {
  const rolledDice = await getRolledDice(actionDice);
  const { momentum } = useResourcesStore();

  const actionScore = calculateActionScore(rolledDice, value, modifier, momentum);
  const { dice, outcome } = calculateOutcome(actionScore.score, rolledDice);
  const momentumBurn = isEligibleForMomentumBurn(dice, outcome, momentum) 
  return { dice, outcome, actionScore, momentumBurn };
};

export const followUpRoll = async (dice: DiceComponent[], outcome: string,  score: number, label: string, negated = false, modifier = 0,) => {
 sendRollToChat(initValues.character.id, {
  type: 'move',
  parameters: {
    characterName: initValues.character.name,
    title: 'Rolling ' + label,
    dice,
    outcome,
    score,
    negated,
    modifier,
    label,
  }
 }) 
}


export const getRolledDice = async (dice: DiceComponent[]): Promise<DiceComponent[]> => {
  const formattedDice = formatDiceComponents(dice);
  const rollResults = await getRollFromDispatch({ rolls: formattedDice });
  return convertResultsToDice(dice, rollResults);
};


import { dispatchRef } from '@/relay/relay';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';

const formatDieKey = (index: number) => `dice-${index}`
const formatDie = (dieCount: number, sides: number) => `${dieCount}d${sides}`

type FormatDice = (index :number, dice : DiceComponent[]) => { [key: string]: string } 
const formatDiceComponents: FormatDice = (index, components) => {
  if (index >= components.length) return {};

  const { sides, count = 1 } = components[index];

  return sides
    ? {
        [formatDieKey(index)]: formatDie(count, sides),
        ...formatDiceComponents(index + 1, components),
      }
    : formatDiceComponents(index + 1, components);
};

type RollResults = {
  dice: Array<DiceComponent>;
};
export default async (
  dice: Array<DiceComponent>,
  customDispatch?: Dispatch,
): Promise<RollResults> => {
  // Need a different Relay instance when handling sheet-actions
  const dispatch = customDispatch || (dispatchRef.value as Dispatch);
  const rollResult = await dispatch.roll({ rolls: formatDiceComponents(0, dice) });
  
  const finalisedDice = dice.map((die, index) => {
    die.value = rollResult.results[formatDieKey(index)].results.result
    return die
  })

  return { dice: finalisedDice };
};

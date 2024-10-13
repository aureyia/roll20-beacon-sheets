import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import type { FormattedRoll } from '@/utility/rolls/getRollFromDispatch';

export const formatDieKey = (index: number) => `dice-${index}`;
export const formatDie = (dieCount: number, sides: number) => `${dieCount}d${sides}`;

export type FormatDice = (dice: DiceComponent[], index?: number) => FormattedRoll['rolls'];
export const formatDiceComponents: FormatDice = (components: any, index = 0) => {
  if (components.length === index) {
    return {};
  }

  const { sides, count = 1 } = components[index];

  return {
    [formatDieKey(index)]: formatDie(count, sides),
    ...formatDiceComponents(components, index + 1),
  };
};

export const convertResultsToDice = (
  dice: Array<DiceComponent>,
  rollResults: any,
): Array<DiceComponent> => {
  return dice.map((die, index) => {
    die.value = rollResults.results[formatDieKey(index)].results.result;
    return die;
  });
};

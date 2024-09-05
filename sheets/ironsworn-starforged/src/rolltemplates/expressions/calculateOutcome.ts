import type { DiceComponent } from '../rolltemplates';

export const calculateOutcome = (
  actionScore: number,
  dice: DiceComponent[],
) :string => {

  const [challengeDie1, challengeDie2] = dice
    .filter((die) => die.label?.startsWith('Challenge Dice'))
    .map((die) => die.value)
    .sort((a, b) => (typeof a === 'number' && typeof b === 'number') ? a - b : 0);

  if (!challengeDie1 || !challengeDie2) {
    throw new Error('Challenge dice not found');
  }

  if (challengeDie1 === challengeDie2) {
    if (actionScore > challengeDie1) {
      return 'opportunity';
    } else if (actionScore <= challengeDie1) {
      return 'complication';
    } else {
      throw new Error('Challenge dice not found');
    }
  } else {
    if (actionScore > challengeDie1 && actionScore > challengeDie2) {
      return 'strong-hit';
    } else if (actionScore > challengeDie1 || actionScore > challengeDie2) {
      return 'weak-hit';
    } else {
      return 'miss';
    }
  }
};

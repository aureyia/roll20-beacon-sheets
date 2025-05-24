import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';

/**
 * Calculates the Action Score for a given roll, taking into account the stat value, modifier, and momentum.
 * @param {DiceComponent[]} dice The dice components of the roll.
 * @param {number} statValue The ability value of the roll.
 * @param {number} [modifier=0] The modifier to apply to the roll.
 * @param {number} [momentum=0] The momentum value to check against the die value.
 * @returns {{score: number, dieNegated: boolean}} An object with the final score, whether the die was negated, and the modifier used.
 */
export const calculateActionScore = (
  dice: DiceComponent[],
  statValue: number,
  modifier: number,
  momentum: number,
): { score: number; dieNegated: boolean } => {
  const actionDie = dice.find((die) => die.label === 'Action Die');
  const dieValue = actionDie?.value ?? 0;
  const isDieNegated = dieValue === -momentum;

  const score = isDieNegated
    ? statValue + modifier
    : dieValue + statValue + modifier;
  const finalScore = Math.min(score, 10);

  return { score: finalScore, dieNegated: isDieNegated };
};

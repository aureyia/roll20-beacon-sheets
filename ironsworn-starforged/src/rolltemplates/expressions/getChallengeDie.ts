import type { DiceComponent } from '../rolltemplates';

/**
 * Finds the value of the Challenge Die in a given array of dice components.
 * @param {DiceComponent[]} dice The array of dice components to search.
 * @param {number} position The position of the Challenge Die to find (1 or 2).
 * @returns {number | undefined} The value of the Challenge Die, or undefined if not found.
 */
export const getChallengeDie = (dice: DiceComponent[], position: number) =>
  dice.find((die) => die.label === `Challenge Die: ${position}`)?.value;

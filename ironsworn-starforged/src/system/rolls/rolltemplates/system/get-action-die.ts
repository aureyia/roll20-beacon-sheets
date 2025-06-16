import type { DiceComponent } from '../rolltemplates'

/**
 * Finds the value of the Action Die in a given array of dice components.
 * @param {DiceComponent[]} dice The array of dice components to search.
 * @returns {number | undefined} The value of the Action Die, or undefined if not found.
 */
export const getActionDie = (dice: DiceComponent[]) =>
    dice.find(die => die.label === 'Action Die')?.value

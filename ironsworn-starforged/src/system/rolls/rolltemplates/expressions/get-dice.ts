import type { DiceComponent } from '../rolltemplates'

/**
 * Takes an array of DiceComponent objects and returns a new array with only the objects that have either a sides or rollFormula property.
 * This is useful for filtering out non-dice components from a roll template's components array.
 */
export const getDice = (components: DiceComponent[]) =>
    components.filter(prop => prop.sides || prop.rollFormula)

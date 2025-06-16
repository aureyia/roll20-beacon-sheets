import type { DiceComponent } from '../rolltemplates'

export const calculateOutcome = (
  score: number,
  dice: DiceComponent[]
): string => {
  const [challengeDie1, challengeDie2] = dice
    .filter(die => die.label?.startsWith('Challenge Die'))
    .map(die => die.value)
    .sort((a, b) =>
      typeof a === 'number' && typeof b === 'number' ? a - b : 0
    )

  if (!challengeDie1 || !challengeDie2) {
    throw new Error('Challenge die not found')
  }

  if (challengeDie1 === challengeDie2) {
    if (score > challengeDie1) {
      return 'opportunity'
    } else if (score <= challengeDie1) {
      return 'complication'
    } else {
      throw new Error('Challenge die not found')
    }
  } else {
    if (score > challengeDie1 && score > challengeDie2) {
      return 'strong-hit'
    } else if (score > challengeDie1 || score > challengeDie2) {
      return 'weak-hit'
    } else {
      return 'miss'
    }
  }
}

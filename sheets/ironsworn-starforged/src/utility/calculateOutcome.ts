import type { DiceComponent } from '@/rolltemplates/rolltemplates';

export const calculateOutcome = (
  score: number,
  dice: DiceComponent[],
) :{ outcome: string, dice: DiceComponent[] } => {

  const [challengeDie1, challengeDie2] = getChallengeDiceValue(dice)

  if (!challengeDie1 || !challengeDie2) {
    throw new Error('At least one Challenge Die is missing')
  }

  if (challengeDie1 === challengeDie2) {
    if (score > challengeDie1) {
      return { outcome: 'opportunity', dice: updateExceededChallengeDie(dice, true, true) }
    } else {
      return { outcome: 'complication', dice: updateExceededChallengeDie(dice, false, false) }
    }
  } else {
    if (score > challengeDie1 && score > challengeDie2) {
      return { outcome: 'strong-hit', dice: updateExceededChallengeDie(dice, true, true) }
    } else if (score > challengeDie1) {
      return { outcome: 'weak-hit', dice: updateExceededChallengeDie(dice, true, false) }
    } else if (score > challengeDie2) {
      return { outcome: 'weak-hit', dice: updateExceededChallengeDie(dice, false, true) }
    } else {
      return { outcome: 'miss', dice: updateExceededChallengeDie(dice, false, false) }
    }
  }
};

export const getChallengeDiceValue = (dice: DiceComponent[]) => 
  dice
    .filter((die) => die.label?.startsWith('Challenge Die'))
    .map((die) => die.value) 

const updateExceededChallengeDie = (dice: DiceComponent[], die1Exceeded: boolean, die2Exceeded: boolean) =>
  dice.map((die) => {
    const dieLabel = die.label;
    const isDie1 = dieLabel === 'Challenge Die: 1';
    const isDie2 = dieLabel === 'Challenge Die: 2';

    if (isDie1 && die1Exceeded) {
      die.exceeded = true;
    } else if (isDie1 && !die1Exceeded) {
      die.exceeded = false;
    }

    if (isDie2 && die2Exceeded) {
      die.exceeded = true;
    } else if (isDie2 && !die2Exceeded) {
      die.exceeded = false;
    }

    return die;
  });

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest

  describe('calculateOutcome', () => {
    it('opportunity', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 2}, { label: 'Challenge Die: 2', value: 2}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 2, exceeded: true}, { label: 'Challenge Die: 2', value: 2, exceeded: true}]
      expect(calculateOutcome(10, inputDice)).toStrictEqual({outcome: 'opportunity', dice: outputDice})
    })
    it('complication', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 3}, { label: 'Challenge Die: 2', value: 3}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 3, exceeded: false}, { label: 'Challenge Die: 2', value: 3, exceeded: false}]
      expect(calculateOutcome(1, inputDice)).toStrictEqual({outcome: 'complication', dice: outputDice})
    })
    it('strong-hit', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 3}, { label: 'Challenge Die: 2', value: 4}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 3, exceeded: true}, { label: 'Challenge Die: 2', value: 4, exceeded: true}]
      expect(calculateOutcome(5, inputDice)).toStrictEqual({outcome: 'strong-hit', dice: outputDice})
    })
    it('weak-hit-1', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 1}, { label: 'Challenge Die: 2', value: 7}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 1, exceeded: true}, { label: 'Challenge Die: 2', value: 7, exceeded: false}]
      expect(calculateOutcome(4, inputDice)).toStrictEqual({outcome: 'weak-hit', dice: outputDice})
    })
    it('weak-hit-2', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 8}, { label: 'Challenge Die: 2', value: 5}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 8, exceeded: false}, { label: 'Challenge Die: 2', value: 5, exceeded: true}]
      expect(calculateOutcome(7, inputDice)).toStrictEqual({outcome: 'weak-hit', dice: outputDice})
    })
    it('miss', () => {
      const inputDice =  [{ label: 'Challenge Die: 1', value: 7}, { label: 'Challenge Die: 2', value: 8}]
      const outputDice =  [{ label: 'Challenge Die: 1', value: 7, exceeded: false}, { label: 'Challenge Die: 2', value: 8, exceeded: false}]
      expect(calculateOutcome(6, inputDice)).toStrictEqual({outcome: 'miss', dice: outputDice})
    })
  })

  describe('updateExceededChallengeDie', () => {
    const dice = [ { label: 'Challenge Die: 1', value: 5 }, { label: 'Challenge Die: 2', value: 5} ]
    it('all true', () => {
      const expectedDice = [ {label: 'Challenge Die: 1', value: 5, exceeded: true}, {label: 'Challenge Die: 2', value: 5, exceeded: true} ]
      expect(updateExceededChallengeDie(dice, true, true )).toStrictEqual(expectedDice)
    })
    it('all false', () => {
      const expectedDice = [ {label: 'Challenge Die: 1', value: 5, exceeded: false}, {label: 'Challenge Die: 2', value: 5, exceeded: false} ]
      expect(updateExceededChallengeDie(dice, false, false )).toStrictEqual(expectedDice)
    })
    it('challenger dice 1 true', () => {
      const expectedDice = [ {label: 'Challenge Die: 1', value: 5, exceeded: true}, {label: 'Challenge Die: 2', value: 5, exceeded: false} ]
      expect(updateExceededChallengeDie(dice, true, false )).toStrictEqual(expectedDice)
    })
    it('challenge dice 2 true', () => {
      const expectedDice = [ {label: 'Challenge Die: 1', value: 5, exceeded: false}, {label: 'Challenge Die: 2', value: 5, exceeded: true} ]
      expect(updateExceededChallengeDie(dice, false, true )).toStrictEqual(expectedDice)
    })
  })
}

import { initValues } from '@/relay/relay';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { sendRollToChat } from '@/utility/sendRollToChat';
import { convertResultsToDice, formatDiceComponents } from '@/utility/convertResultsToDice';
import { getRollFromDispatch } from '@/utility/getRollFromDispatch';
import { actionDice } from '@/system/dice';
import { DiceComponent } from '@/rolltemplates/rolltemplates';
import { calculateOutcome, getChallengeDice } from './calculateOutcome';
import { calculateActionScore } from './calculateActionScore';

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
  return { dice, outcome, actionScore };
};

export const isEligableForMomemtumBurn = (
  rolledDice: DiceComponent[],
  outcome: string,
  momentum: number,
): { eligibility: boolean; outcome: string; newOutcome?: string } => {
  const [challengeDie1, challengeDie2] = rolledDice.filter((die) =>
    die.label?.startsWith('Challenge Die'),
  );
  
  console.log(challengeDie1, challengeDie2)

  if (!challengeDie1.exceeded || !challengeDie2.exceeded) {
    if (outcome === 'complication') {
      if (challengeDie1.value < momentum && challengeDie2.value < momentum) {
        return { eligibility: true, outcome, newOutcome: 'opportunity' };
      } else {
        return { eligibility: false, outcome };
      }
    } else if (outcome === 'miss') {
      if (challengeDie1.value < momentum && challengeDie2.value < momentum) {
        return { eligibility: true, outcome, newOutcome: 'strong-hit' };
      } else if (challengeDie1.value < momentum || challengeDie2.value < momentum) {
        return { eligibility: true, outcome, newOutcome: 'weak-hit' };
      } else {
        return { eligibility: false, outcome };
      }
    } else if (outcome === 'weak-hit') {
      if (
        (!challengeDie1.exceeded && challengeDie1.value < momentum) ||
        (!challengeDie2.exceeded && challengeDie2.value < momentum)
      ) {
        return { eligibility: true, outcome, newOutcome: 'strong-hit' };
      } else {
        return { eligibility: false, outcome };
      }
    } else {
      throw Error(`An unexpected outcome was used: "${outcome}"`);
    }
  } else {
    return { eligibility: false, outcome };
  }
};

export const getRolledDice = async (dice: DiceComponent[]): Promise<DiceComponent[]> => {
  const formattedDice = formatDiceComponents(dice);
  const rollResults = await getRollFromDispatch({ rolls: formattedDice });
  return convertResultsToDice(dice, rollResults);
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe('isEligibleForMomentumBurn', () => {
    it('complication -> opportunity', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'complication', 10)).toStrictEqual({
        eligibility: true,
        outcome: 'complication',
        newOutcome: 'opportunity',
      });
    });
    it('complication not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 10, exceeded: false },
        { label: 'Challenge Die: 2', value: 10, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'complication', 10)).toStrictEqual({
        eligibility: false,
        outcome: 'complication',
      });
    });
    it('miss -> strong-hit', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 7, exceeded: false },
        { label: 'Challenge Die: 2', value: 6, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'miss', 8)).toStrictEqual({
        eligibility: true,
        outcome: 'miss',
        newOutcome: 'strong-hit',
      });
    });
    it('miss -> weak-hit - 1', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 7, exceeded: false },
        { label: 'Challenge Die: 2', value: 6, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'miss', 7)).toStrictEqual({
        eligibility: true,
        outcome: 'miss',
        newOutcome: 'weak-hit',
      });
    });
    it('miss -> weak-hit - 2', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: false },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'miss', 7)).toStrictEqual({
        eligibility: true,
        outcome: 'miss',
        newOutcome: 'weak-hit',
      });
    });
    it('miss not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: false },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'miss', 5)).toStrictEqual({
        eligibility: false,
        outcome: 'miss',
      });
    });
    it('weak-hit -> strong-hit - 1', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 3, exceeded: true },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'weak-hit', 7)).toStrictEqual({
        eligibility: true,
        outcome: 'weak-hit',
        newOutcome: 'strong-hit',
      });
    });
    it('weak-hit -> strong-hit - 2', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 3, exceeded: true },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'weak-hit', 7)).toStrictEqual({
        eligibility: true,
        outcome: 'weak-hit',
        newOutcome: 'strong-hit',
      });
    });
    it('weak-hit not elgible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'weak-hit', 3)).toStrictEqual({
        eligibility: false,
        outcome: 'weak-hit',
      });
    });
    it('unexpected outcome used', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      expect(() => isEligableForMomemtumBurn(rolledDice, 'strong-hit', 7))
        .toThrowError('An unexpected outcome was used: "strong-hit"')
    });
    it('strong-hit not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: true },
      ];
      expect(isEligableForMomemtumBurn(rolledDice, 'strong-hit', 8)).toStrictEqual({
        eligibility: false,
        outcome: 'strong-hit',
      });
    });
  });
}

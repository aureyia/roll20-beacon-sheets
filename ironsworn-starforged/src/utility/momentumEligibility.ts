import type { DiceComponent } from '@/rolltemplates/rolltemplates';

type EligibilityResult = {
  eligibility: boolean;
  newOutcome?: string;
};
const formatResult = (eligibility: boolean, newOutcome?: string): EligibilityResult => ({
  eligibility,
  ...(newOutcome && { newOutcome }),
});

export const isEligibleForMomentumBurn = (
  rolledDice: DiceComponent[],
  outcome: string,
  momentum: number,
  option: any,
): { eligibility: boolean; newOutcome?: string } => {
  const [challengeDie1, challengeDie2] = rolledDice.filter((die) =>
    die.label?.startsWith('Challenge Die'),
  );

  if (!challengeDie1.value || !challengeDie2.value) {
    throw Error('Missing Challenge Dice values');
  }

  const d1Ex = challengeDie1.exceeded;
  const d2Ex = challengeDie2.exceeded;

  const isComplication = outcome === 'complication';
  const isMiss = outcome === 'miss';
  const isWeakHit = outcome === 'weak-hit';
  const isStrongHit = outcome === 'strong-hit';
  const isOpportunity = outcome === 'opportunity';

  const d1IsEligible = challengeDie1.value < momentum;
  const d2IsEligible = challengeDie2.value < momentum;

  if (isOpportunity || isStrongHit || option['Roll type'] === 'Progress roll') {
    return formatResult(false);
  }

  if (!isComplication && !isMiss && !isWeakHit) {
    throw Error(`An unexpected outcome was used: "${outcome}"`);
  }

  if (isComplication) {
    return d1IsEligible && d2IsEligible ? formatResult(true, 'opportunity') : formatResult(false);
  }

  if (isMiss) {
    if (d1IsEligible && d2IsEligible) {
      return formatResult(true, 'strong-hit');
    }

    if (d1IsEligible || d2IsEligible) {
      return formatResult(true, 'weak-hit');
    }

    return formatResult(false);
  }

  if (isWeakHit) {
    return (!d1Ex && d1IsEligible) || (!d2Ex && d2IsEligible)
      ? formatResult(true, 'strong-hit')
      : formatResult(false);
  }

  throw Error(`An unexpected outcome was used: ${outcome}`);
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe('isEligibleForMomentumBurn', () => {
    it('complication -> opportunity', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'complication', 10, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'opportunity',
      });
    });
    it('complication not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 10, exceeded: false },
        { label: 'Challenge Die: 2', value: 10, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'complication', 10, option)).toStrictEqual({
        eligibility: false,
      });
    });
    it('miss -> strong-hit', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 7, exceeded: false },
        { label: 'Challenge Die: 2', value: 6, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'miss', 8, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'strong-hit',
      });
    });
    it('miss -> weak-hit - 1', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 7, exceeded: false },
        { label: 'Challenge Die: 2', value: 6, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'miss', 7, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'weak-hit',
      });
    });
    it('miss -> weak-hit - 2', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: false },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'miss', 7, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'weak-hit',
      });
    });
    it('miss not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: false },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'miss', 5, option)).toStrictEqual({
        eligibility: false,
      });
    });
    it('weak-hit -> strong-hit - 1', () => {
      const option = { 'Roll type': 'Action roll' };
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 3, exceeded: true },
      ];
      expect(isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'strong-hit',
      });
    });
    it('weak-hit -> strong-hit - 2', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 3, exceeded: true },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option)).toStrictEqual({
        eligibility: true,
        newOutcome: 'strong-hit',
      });
    });
    it('weak-hit not elgible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'weak-hit', 3, option)).toStrictEqual({
        eligibility: false,
      });
    });
    it('strong-hit not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: true },
      ];
      const option = { 'Roll type': 'Action roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'strong-hit', 8, option)).toStrictEqual({
        eligibility: false,
      });
    });
    it('progress roll not eligible', () => {
      const rolledDice: DiceComponent[] = [
        { label: 'Challenge Die: 1', value: 6, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: true },
      ];
      const option = { 'Roll type': 'Progress roll' };
      expect(isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option)).toStrictEqual({
        eligibility: false,
      });
    });
  });
}

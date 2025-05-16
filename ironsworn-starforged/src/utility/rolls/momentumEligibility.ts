import type { DiceComponent } from '@/internal/rolls/application/rolltemplates/rolltemplates';

type EligibilityResult = {
  eligibility: boolean;
  newOutcome?: string;
};
const formatResult = (
  eligibility: boolean,
  newOutcome?: string,
): EligibilityResult => ({
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
    return d1IsEligible && d2IsEligible
      ? formatResult(true, 'opportunity')
      : formatResult(false);
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

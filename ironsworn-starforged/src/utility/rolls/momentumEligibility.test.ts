import { describe, it, expect } from 'vitest';
import { isEligibleForMomentumBurn } from './momentumEligibility';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';

describe('isEligibleForMomentumBurn', () => {
  it('complication -> opportunity', () => {
    const rolledDice: DiceComponent[] = [
      { label: 'Challenge Die: 1', value: 5, exceeded: false },
      { label: 'Challenge Die: 2', value: 5, exceeded: false },
    ];
    const option = { 'Roll type': 'Action roll' };
    expect(
      isEligibleForMomentumBurn(rolledDice, 'complication', 10, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'complication', 10, option),
    ).toStrictEqual({
      eligibility: false,
    });
  });
  it('miss -> strong-hit', () => {
    const rolledDice: DiceComponent[] = [
      { label: 'Challenge Die: 1', value: 7, exceeded: false },
      { label: 'Challenge Die: 2', value: 6, exceeded: false },
    ];
    const option = { 'Roll type': 'Action roll' };
    expect(
      isEligibleForMomentumBurn(rolledDice, 'miss', 8, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'miss', 7, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'miss', 7, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'miss', 5, option),
    ).toStrictEqual({
      eligibility: false,
    });
  });
  it('weak-hit -> strong-hit - 1', () => {
    const option = { 'Roll type': 'Action roll' };
    const rolledDice: DiceComponent[] = [
      { label: 'Challenge Die: 1', value: 5, exceeded: false },
      { label: 'Challenge Die: 2', value: 3, exceeded: true },
    ];
    expect(
      isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option),
    ).toStrictEqual({
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
    expect(
      isEligibleForMomentumBurn(rolledDice, 'weak-hit', 3, option),
    ).toStrictEqual({
      eligibility: false,
    });
  });
  it('strong-hit not eligible', () => {
    const rolledDice: DiceComponent[] = [
      { label: 'Challenge Die: 1', value: 6, exceeded: true },
      { label: 'Challenge Die: 2', value: 7, exceeded: true },
    ];
    const option = { 'Roll type': 'Action roll' };
    expect(
      isEligibleForMomentumBurn(rolledDice, 'strong-hit', 8, option),
    ).toStrictEqual({
      eligibility: false,
    });
  });
  it('progress roll not eligible', () => {
    const rolledDice: DiceComponent[] = [
      { label: 'Challenge Die: 1', value: 6, exceeded: true },
      { label: 'Challenge Die: 2', value: 7, exceeded: true },
    ];
    const option = { 'Roll type': 'Progress roll' };
    expect(
      isEligibleForMomentumBurn(rolledDice, 'weak-hit', 7, option),
    ).toStrictEqual({
      eligibility: false,
    });
  });
});

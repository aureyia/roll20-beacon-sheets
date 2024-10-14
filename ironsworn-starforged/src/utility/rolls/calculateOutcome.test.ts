import { describe, it, expect } from "vitest";
import { calculateOutcome, updateExceededChallengeDie } from '@/utility/rolls/calculateOutcome';
import { Effect } from "effect";

  describe('calculateOutcome', () => {
    it('opportunity', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 2 },
        { label: 'Challenge Die: 2', value: 2 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 2, exceeded: true },
        { label: 'Challenge Die: 2', value: 2, exceeded: true },
      ];
      expect(Effect.runSync(calculateOutcome(10, inputDice))).toStrictEqual({
        outcome: 'opportunity',
        dice: outputDice,
      });
    });
    it('complication', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 3 },
        { label: 'Challenge Die: 2', value: 3 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 3, exceeded: false },
        { label: 'Challenge Die: 2', value: 3, exceeded: false },
      ];
      expect(Effect.runSync(calculateOutcome(1, inputDice))).toStrictEqual({
        outcome: 'complication',
        dice: outputDice,
      });
    });
    it('strong-hit', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 3 },
        { label: 'Challenge Die: 2', value: 4 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 3, exceeded: true },
        { label: 'Challenge Die: 2', value: 4, exceeded: true },
      ];
      expect(Effect.runSync(calculateOutcome(5, inputDice))).toStrictEqual({
        outcome: 'strong-hit',
        dice: outputDice,
      });
    });
    it('weak-hit-1', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 1 },
        { label: 'Challenge Die: 2', value: 7 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 1, exceeded: true },
        { label: 'Challenge Die: 2', value: 7, exceeded: false },
      ];
      expect(Effect.runSync(calculateOutcome(4, inputDice))).toStrictEqual({
        outcome: 'weak-hit',
        dice: outputDice,
      });
    });
    it('weak-hit-2', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 8 },
        { label: 'Challenge Die: 2', value: 5 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 8, exceeded: false },
        { label: 'Challenge Die: 2', value: 5, exceeded: true },
      ];
      expect(Effect.runSync(calculateOutcome(7, inputDice))).toStrictEqual({
        outcome: 'weak-hit',
        dice: outputDice,
      });
    });
    it('miss', () => {
      const inputDice = [
        { label: 'Challenge Die: 1', value: 7 },
        { label: 'Challenge Die: 2', value: 8 },
      ];
      const outputDice = [
        { label: 'Challenge Die: 1', value: 7, exceeded: false },
        { label: 'Challenge Die: 2', value: 8, exceeded: false },
      ];
      expect(Effect.runSync(calculateOutcome(6, inputDice))).toStrictEqual({ outcome: 'miss', dice: outputDice });
    });
  });

  describe('updateExceededChallengeDie', () => {
    const dice = [
      { label: 'Challenge Die: 1', value: 5 },
      { label: 'Challenge Die: 2', value: 5 },
    ];
    it('all true', () => {
      const expectedDice = [
        { label: 'Challenge Die: 1', value: 5, exceeded: true },
        { label: 'Challenge Die: 2', value: 5, exceeded: true },
      ];
      expect(updateExceededChallengeDie(dice, true, true)).toStrictEqual(expectedDice);
    });
    it('all false', () => {
      const expectedDice = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      expect(updateExceededChallengeDie(dice, false, false)).toStrictEqual(expectedDice);
    });
    it('challenger dice 1 true', () => {
      const expectedDice = [
        { label: 'Challenge Die: 1', value: 5, exceeded: true },
        { label: 'Challenge Die: 2', value: 5, exceeded: false },
      ];
      expect(updateExceededChallengeDie(dice, true, false)).toStrictEqual(expectedDice);
    });
    it('challenge dice 2 true', () => {
      const expectedDice = [
        { label: 'Challenge Die: 1', value: 5, exceeded: false },
        { label: 'Challenge Die: 2', value: 5, exceeded: true },
      ];
      expect(updateExceededChallengeDie(dice, false, true)).toStrictEqual(expectedDice);
    });
  });

import { type Task } from '@/sheet/stores/chronicle/tasksStore';
import { pipe } from 'effect';

const MAX_TICKS_PER_BOX = 4 as const;
const NO_TICKS = 0 as const;

const progressRequiredToFillBox = (positionInProgressTrack: number): number => MAX_TICKS_PER_BOX * positionInProgressTrack;

export type ProgressTicksToFill = (position: number, currentProgress: Task['progress']) => Task['progress'];
export const progressTicksToFill: ProgressTicksToFill = (position: number, currentProgress: number): number => {
  return pipe(
    position,
    progressRequiredToFillBox,
    (requiredProgress: number) => currentProgress - requiredProgress,
    (difference: number) => Math.min(MAX_TICKS_PER_BOX, difference),
    (lowestTicks: number) => Math.max(NO_TICKS, lowestTicks)
  )
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;
  describe('progressTicksToFill', () => {
    const data = [
      { box: 0, ticks: -1, expected: 0 },
      { box: 0, ticks: 0, expected: 0 },
      { box: 0, ticks: 1, expected: 1 },
      { box: 0, ticks: 2, expected: 2 },
      { box: 0, ticks: 3, expected: 3 },
      { box: 0, ticks: 4, expected: 4 },
      { box: 0, ticks: 5, expected: 4 },
      { box: 1, ticks: 4, expected: 0 },
      { box: 1, ticks: 5, expected: 1 },
      { box: 1, ticks: 6, expected: 2 },
      { box: 1, ticks: 7, expected: 3 },
      { box: 1, ticks: 8, expected: 4 },
      { box: 1, ticks: 9, expected: 4 },
      { box: 2, ticks: 8, expected: 0 },

    ] as const;

    data.forEach(({ box, ticks, expected }) => {
      test(`Box ${box} - progress ${ticks}`, () => {
        expect(progressTicksToFill(box, ticks)).toEqual(expected);
      });
    });
  });
}

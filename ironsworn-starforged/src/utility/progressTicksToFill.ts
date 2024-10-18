import { type Task } from '@/sheet/stores/chronicle/tasksStore';
import { pipe } from 'effect';
import { assert } from '@/utility/assert';
import { isNumberBetween } from './isNumberBetween';

export type ProgressTicksToFill = (
  position: number,
  currentProgress: Task['progress'],
) => Task['progress'];
export const progressTicksToFill: ProgressTicksToFill = (
  positionInTrack: number,
  currentProgress: number,
): number => {
  assert(isNumberBetween(positionInTrack, 0, 10), `positionInTrack: ${positionInTrack}`);
  assert(isNumberBetween(currentProgress, 0, 40), `currentProgress: ${currentProgress}`);

  const MAX_TICKS_PER_BOX = 4 as const;
  const NO_TICKS = 0 as const;

  const result = pipe(
    positionInTrack,
    (position) => MAX_TICKS_PER_BOX * position,
    (requiredProgress) => currentProgress - requiredProgress,
    (difference) => Math.min(MAX_TICKS_PER_BOX, difference),
    (lowestTicks) => Math.max(NO_TICKS, lowestTicks),
  );

  assert(isNumberBetween(result, 0, 4), `result: ${result}`);
  return result;
};

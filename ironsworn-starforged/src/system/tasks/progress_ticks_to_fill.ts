import { pipe } from 'effect'
import type { Task } from '@/system/tasks/store'
import { assert } from '@/utility/assert'
import { is_number_between } from '../../utility/is_number_between'

export type ProgressTicksToFill = (
    position: number,
    currentProgress: Task['progress']
) => Task['progress']
export const progressTicksToFill: ProgressTicksToFill = (
    positionInTrack: number,
    currentProgress: number
): number => {
    const MAX_TOTAL_PROGRESS = 40 as const
    const FINAL_TRACK_POSITION = 10 as const

    assert(is_number_between(positionInTrack, 0, FINAL_TRACK_POSITION))
    assert(is_number_between(currentProgress, 0, MAX_TOTAL_PROGRESS))

    const MAX_TICKS_PER_BOX = 4 as const
    const NO_TICKS = 0 as const

    const result = pipe(
        positionInTrack,
        position => MAX_TICKS_PER_BOX * position,
        requiredProgress => currentProgress - requiredProgress,
        difference => Math.min(MAX_TICKS_PER_BOX, difference),
        lowestTicks => Math.max(NO_TICKS, lowestTicks)
    )

    assert(is_number_between(result, NO_TICKS, MAX_TICKS_PER_BOX))
    return result
}

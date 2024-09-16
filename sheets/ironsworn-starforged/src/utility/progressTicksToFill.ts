import { type Task } from '@/sheet/stores/chronicle/tasksStore';

const MAX_TICKS_PER_BOX = 4 as const
const NO_TICKS = 0 as const

const requiredProgressToFillBox = (positionInProgressTrack:Task['progress']) => MAX_TICKS_PER_BOX * positionInProgressTrack
const theLowestBetweenMaxTicksAnd = (difference: number) => Math.min(MAX_TICKS_PER_BOX, difference)
const differenceBetween = (currentProgress :Task['progress'])  => (requiredProgress: number) =>  currentProgress - requiredProgress

export type ProgressTicksToFill = (i: number) => (p: Task['progress']) => Task['progress']
export const progressTicksToFill: ProgressTicksToFill = 
  positionInProgressTrack => 
    currentProgress => 
      Math.max(NO_TICKS, theLowestBetweenMaxTicksAnd(differenceBetween(currentProgress)(requiredProgressToFillBox(positionInProgressTrack))))
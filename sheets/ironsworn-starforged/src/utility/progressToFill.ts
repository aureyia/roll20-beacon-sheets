import { type Task } from '@/sheet/stores/chronicle/tasksStore';

export type ProgressToFill = (i: number) => (p: Task['progress']) => Task['progress']
export const progressToFill: ProgressToFill = i => p => Math.max(0, Math.min(4, p - i * 4))
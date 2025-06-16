import type { LimitedRange } from '@/utility/limited-range'

export const DIFFICULTIES = [
  'troublesome',
  'dangerous',
  'formidable',
  'extreme',
  'epic',
] as const

export type ProgressRange = LimitedRange<0, 40>
export type Task = {
  _id: string
  description: string
  category: typeof TaskCategory
  progress: number
  difficulty: typeof Difficulty
  status: typeof TaskStatus
  countdown?: Countdown
}

export type Vow = Omit<Task, 'countdown'>
export type GenericTask = Omit<Task, 'countdown'>
export const Difficulty = {
  Troublesome: 'troublesome',
  Dangerous: 'dangerous',
  Formidable: 'formidable',
  Extreme: 'extreme',
  Epic: 'epic',
} as const

export const TaskCategory = {
  Vow: 'vow',
  GenericTask: 'generic',
  SceneChallenge: 'challenge',
} as const

export const TaskStatus = {
  Active: 'active',
  Completed: 'completed',
  Failed: 'failed',
  Abandoned: 'abandoned',
} as const

export type Countdown = 0 | 1 | 2 | 3 | 4

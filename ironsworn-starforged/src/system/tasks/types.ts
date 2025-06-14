import { type LimitedRange } from '@/utility/limited-range';

export const DIFFICULTIES = [
  'troublesome',
  'dangerous',
  'formidable',
  'extreme',
  'epic',
] as const;

export type ProgressRange = LimitedRange<0, 40>;
export type Task = {
  _id: string;
  description: string;
  category: TaskCategory;
  progress: number;
  difficulty: Difficulty;
  status: TaskStatus;
  countdown?: Countdown;
};

export type Vow = Omit<Task, 'countdown'>;
export type GenericTask = Omit<Task, 'countdown'>;
export enum Difficulty {
  Troublesome = 'troublesome',
  Dangerous = 'dangerous',
  Formidable = 'formidable',
  Extreme = 'extreme',
  Epic = 'epic',
}

export enum TaskCategory {
  Vow = 'vow',
  GenericTask = 'generic',
  SceneChallenge = 'challenge',
}

export enum TaskStatus {
  Active = 'active',
  Completed = 'completed',
  Failed = 'failed',
  Abandoned = 'abandoned',
}

export type Countdown = 0 | 1 | 2 | 3 | 4;

import { progressTicksToFill } from './progressTicksToFill';
import { expect, describe, test } from 'vitest';

describe('progressTicksToFill', () => {
  const data = [
    { box: 0, ticks: 0, expected: 0 },
    { box: 0, ticks: 1, expected: 1 },
    { box: 0, ticks: 2, expected: 2 },
    { box: 0, ticks: 3, expected: 3 },
    { box: 0, ticks: 4, expected: 4 },
    { box: 1, ticks: 4, expected: 0 },
    { box: 1, ticks: 5, expected: 1 },
    { box: 1, ticks: 6, expected: 2 },
    { box: 1, ticks: 7, expected: 3 },
    { box: 1, ticks: 8, expected: 4 },
    { box: 2, ticks: 8, expected: 0 },
    { box: 3, ticks: 8, expected: 0 },
  ] as const;

  data.forEach(({ box, ticks, expected }) => {
    test(`Box ${box} - progress ${ticks}`, () => {
      expect(progressTicksToFill(box)(ticks)).toEqual(expected);
    });
  });
});

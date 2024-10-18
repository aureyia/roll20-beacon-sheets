import {
  actionRollResults,
  taskRollResults,
  oracleRollResults,
} from '@/utility/__mocks__/example-rolls';
import { oracleDie, actionDice, taskDice } from '@/system/dice';
import { convertResultsToDice, formatDiceComponents } from './convertResultsToDice';
import { it, expect, describe } from 'vitest';

describe('convertResultsToDice', () => {
  it('convertResultsToDice - Action', () => {
    expect(convertResultsToDice(actionDice, actionRollResults)).toStrictEqual([
      {
        sides: 6,
        label: 'Action Die',
        value: 5,
      },
      {
        sides: 10,
        label: 'Challenge Die: 1',
        value: 10,
      },
      {
        sides: 10,
        label: 'Challenge Die: 2',
        value: 2,
      },
    ]);
  });
  it('convertResultsToDice - Task', () => {
    expect(convertResultsToDice(taskDice, taskRollResults)).toStrictEqual([
      {
        sides: 10,
        label: 'Challenge Die: 1',
        value: 6,
      },
      {
        sides: 10,
        label: 'Challenge Die: 2',
        value: 10,
      },
    ]);
  });

  it('convertResultsToDice - Oracle', () => {
    expect(convertResultsToDice(oracleDie, oracleRollResults)).toStrictEqual([
      {
        sides: 100,
        label: 'Oracle Die',
        value: 94,
      },
    ]);
  });
});

describe('formatDiceComponents', () => {
  it('formatDiceComponents - Action', () => {
    expect(formatDiceComponents(actionDice)).toStrictEqual({
      'dice-0': '1d6',
      'dice-1': '1d10',
      'dice-2': '1d10',
    });
  });
  it('formatDiceComponents - Task', () => {
    expect(formatDiceComponents(taskDice)).toStrictEqual({
      'dice-0': '1d10',
      'dice-1': '1d10',
    });
  });
  it('formatDiceComponents - Oracle', () => {
    expect(formatDiceComponents(oracleDie)).toStrictEqual({
      'dice-0': '1d100',
    });
  });
});

import getRollResult from '@/utility/getRollResult';
import { actionDice, taskDice, oracleDice } from '@/system/dice';
import { dispatchRef } from '@/relay/relay';
import { expect, describe, vi, test } from 'vitest';

describe('getRollResults', () => {
  test('Action Roll', async () => {
    const mockDispatch = {
      roll: vi.fn().mockResolvedValue(actionMockObject),
    };

    dispatchRef.value = mockDispatch;

    vi.spyOn(dispatchRef.value, 'roll');

    const { dice } = await getRollResult(actionDice, dispatchRef.value);

    expect(dispatchRef.value.roll).toHaveBeenCalled();
    expect(dispatchRef.value.roll).toHaveBeenCalledWith({ rolls: { 'dice-0': '1d6', 'dice-1': '1d10', 'dice-2': '1d10' } });
    expect(dice[0].value).toBe(6);
    expect(dice[1].value).toBe(9);
    expect(dice[2].value).toBe(8);
    expect(dice.length).toBe(3);

    vi.restoreAllMocks();
  });

  test('Progress Roll', async () => {;
    const mockDispatch = {
      roll: vi.fn().mockResolvedValue(progressMockObject),
    };

    dispatchRef.value = mockDispatch;

    vi.spyOn(dispatchRef.value, 'roll');

    const { dice } = await getRollResult(taskDice, dispatchRef.value);

    expect(dispatchRef.value.roll).toHaveBeenCalled();
    expect(dispatchRef.value.roll).toHaveBeenCalledWith({ rolls: { 'dice-0': '1d10', 'dice-1': '1d10' } });
    expect(dice[0].value).toBe(2);
    expect(dice[1].value).toBe(4);
    expect(dice.length).toBe(2);

    vi.restoreAllMocks();
  });

  test('Oracle Roll', async () => {
    const mockDispatch = {
      roll: vi.fn().mockResolvedValue(oracleMockObject),
    };

    dispatchRef.value = mockDispatch;

    vi.spyOn(dispatchRef.value, 'roll');

    const { dice } = await getRollResult(oracleDice, dispatchRef.value);

    expect(dispatchRef.value.roll).toHaveBeenCalled();
    expect(dispatchRef.value.roll).toHaveBeenCalledWith({ rolls: { 'dice-0': '1d100'} });
    expect(dice[0].value).toBe(77);
    expect(dice.length).toBe(1);

    vi.restoreAllMocks();
  });
});

const actionMockObject = {
  results: {
    'dice-0': {
      results: {
        result: 6
      },
    },
    'dice-1': {
      results: {
        result: 9,
      },
    },
    'dice-2': {
      results: {
        result: 8,
      },
    },
  },
}

const progressMockObject = {
  results: {
    'dice-0': {
      results: {
        result: 2,
      },
    },
    'dice-1': {
      results: {
        result: 4,
      },
    },
  },
};

const oracleMockObject = {
  results: {
    'dice-0': {
      results: {
        result: 77
      },
    },
  }
}

const oracleTwoMockObject = {
  results: {
    'dice-0': {
      results: {
        result: 10
      },
    },
  }
}
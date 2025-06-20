import { describe, expect, test } from 'vitest'
import { progressTicksToFill } from './progress_ticks_to_fill'

describe('progressTicksToFill', () => {
    const data = [
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
    ] as const

    for (const { box, ticks, expected } of data) {
        test(`Box ${box} - progress ${ticks}`, () => {
            expect(progressTicksToFill(box, ticks)).toEqual(expected)
        })
    }

    test('throw if first input is string', () => {
        // @ts-expect-error
        expect(() => progressTicksToFill('0', 0)).toThrowError()
    })

    test('throw if second input is string', () => {
        // @ts-expect-error
        expect(() => progressTicksToFill(0, '0')).toThrowError()
    })
})

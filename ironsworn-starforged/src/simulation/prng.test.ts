import { Effect } from 'effect'
import { PRNGLive, PRNG } from './prng'
import { describe, test, vi, expect } from 'vitest'

describe('PRNG', () => {
    test('same number is returned for set seed and salt: 1', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('1', '1')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(354840034)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('1', '1')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(354840034)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('1', '1')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(354840034)
    })

    test('same number is returned for set seed and salt: 2', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('2', '2')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1290403781)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('2', '2')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1290403781)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('2', '2')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1290403781)
    })

    test('same number is returned for set seed and salt: 3', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('3', '3')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1602988142)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('3', '3')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1602988142)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generateRandomNumber('3', '3')
                }).pipe(Effect.provide(PRNGLive))
            )
        ).toBe(1602988142)
    })
})

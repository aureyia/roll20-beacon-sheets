import { Effect } from 'effect'
import { describe, expect, test, vi } from 'vitest'
import { live_prng, PRNG } from './prng'

describe('PRNG', () => {
    test('same number is returned for set seed and salt: 1', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('1', '1')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(354840034)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('1', '1')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(354840034)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('1', '1')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(354840034)
    })

    test('same number is returned for set seed and salt: 2', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('2', '2')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1290403781)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('2', '2')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1290403781)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('2', '2')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1290403781)
    })

    test('same number is returned for set seed and salt: 3', () => {
        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('3', '3')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1602988142)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('3', '3')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1602988142)

        expect(
            Effect.runSync(
                Effect.gen(function* () {
                    const rng = yield* PRNG
                    return rng.generate_random_number('3', '3')
                }).pipe(Effect.provide(live_prng))
            )
        ).toBe(1602988142)
    })
})

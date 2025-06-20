import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils'
import { Context, Effect, Layer } from 'effect'

export class PRNG extends Context.Tag('PRNG')<
    PRNG,
    {
        readonly generate_random_number: (seed: string, salt: string) => number
    }
>() {}

export const live_prng = Layer.effect(
    PRNG,
    Effect.gen(function* () {
        const LCG_CONSTANT = 48271 as const
        const LCG_MOD = 2147483647 as const

        return {
            generate_random_number: (seed, salt) => {
                const hash = bytesToHex(sha256(utf8ToBytes(seed + salt)))
                return Number((BigInt(`0x${hash}`) * BigInt(LCG_CONSTANT)) % BigInt(LCG_MOD)) >>> 0
            },
        }
    })
)

export const number_between = (seed: string, salt: string, min: number, max: number) =>
    Effect.gen(function* () {
        const prng = yield* PRNG
        return (prng.generate_random_number(seed, salt) % (max - min + 1)) + min
    }).pipe(Effect.provide(live_prng))

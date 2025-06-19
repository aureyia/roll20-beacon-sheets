import { Context, Effect, Layer } from 'effect'
import type { IOracle } from '@/vendor/dataforged/dist/types'
import type { Oracle } from './types'

export class Oracles extends Context.Tag('Oracles')<
    Oracles,
    {
        readonly parse: (oracles: IOracle[]) => Effect.Effect<Oracle[]>
    }
>() {}

export const OraclesLive = Layer.effect(
    Oracles,
    Effect.gen(function* () {
        return {
            parse: oracles =>
                Effect.gen(function* () {
                    
                    return yield* Effect.succeed(oracles)
                }),
        }
    })
)

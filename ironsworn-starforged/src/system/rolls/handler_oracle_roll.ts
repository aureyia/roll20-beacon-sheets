import { Context, Effect, Layer } from 'effect'
import { oracleDie } from '@/system/rolls/dice'
import {
    type InvalidDie,
    type InvalidDispatch,
    RollFormatter,
    roll_formatter_live,
} from '@/system/rolls/formatter'
import { type DieNotFound, get_die_by_label } from '@/system/rolls/get_die_by_label'
import { type DispatchError, dispatch_live } from './dispatch'

type OracleRollResult = { oracleDie: { roll: number } }

class OracleRoll extends Context.Tag('OracleRoll')<
    OracleRoll,
    {
        readonly roll: () => Effect.Effect<
            OracleRollResult,
            DispatchError | DieNotFound | InvalidDie | InvalidDispatch
        >
    }
>() {}

const oracle_roll_handler_live = Layer.effect(
    OracleRoll,
    Effect.gen(function* () {
        const formatter = yield* RollFormatter

        return {
            roll: () =>
                Effect.gen(function* () {
                    const dice_rolled = yield* formatter.roll(oracleDie)
                    const die = yield* get_die_by_label(dice_rolled, 'Oracle Die')

                    return {
                        oracleDie: {
                            roll: die.value,
                        },
                    }
                }),
        }
    })
)

const FormatAndRoll = roll_formatter_live.pipe(Layer.provide(dispatch_live))
const main_live = oracle_roll_handler_live.pipe(Layer.provide(FormatAndRoll))

export const roll = () =>
    Effect.provide(
        Effect.flatMap(OracleRoll, handler => handler.roll()),
        main_live
    )

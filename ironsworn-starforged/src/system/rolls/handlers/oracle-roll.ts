import {
  RollFormatterLive,
  RollFormatter,
  InvalidDie,
  InvalidDispatch,
} from '@/system/rolls/formatter'
import { DispatchError, DispatchLive } from '../dispatch'
import { Effect, Context, Layer } from 'effect'
import { oracleDie } from '@/system/rolls/dice'
import { DieNotFound, getDieByLabel } from '@/system/rolls/get-die-by-label'

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

const OracleRollLive = Layer.effect(
  OracleRoll,
  Effect.gen(function* () {
    const formatter = yield* RollFormatter

    return {
      roll: () =>
        Effect.gen(function* () {
          const rolledDice = yield* formatter.roll(oracleDie)
          const die = yield* getDieByLabel(rolledDice, 'Oracle Die')

          return {
            oracleDie: {
              roll: die.value,
            },
          }
        }),
    }
  })
)

const FormatAndRoll = RollFormatterLive.pipe(Layer.provide(DispatchLive))
const MainLive = OracleRollLive.pipe(Layer.provide(FormatAndRoll))

export const roll = () =>
  Effect.provide(
    Effect.flatMap(OracleRoll, handler => handler.roll()),
    MainLive
  )

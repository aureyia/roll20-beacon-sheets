import { Effect, Context, Layer, Data, Schema } from 'effect'
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates'
import type { RolledDie, Die } from '@/system/rolls/dice'
import { assert } from '@/utility/assert'
import type { DieKey } from './dispatch.schema'
import type { DispatchResultsOutput } from './dispatch'

type AvailableDice = '1d6' | '1d10' | '1d100'
type FormattedRoll = {
  rolls: {
    'dice-0': AvailableDice
    'dice-1'?: AvailableDice
    'dice-2'?: AvailableDice
  }
}

const DieSchema = Schema.Struct({})

export class InvalidDie extends Data.TaggedError('InvalidDie')<{
  message: string
}> {}

export class InvalidDispatch extends Data.TaggedError('InvalidDispatch')<{
  message: string
}> {}

export class RollFormatter extends Context.Tag('RollFormatter')<
  RollFormatter,
  {
    readonly toDispatch: (
      dice: Die[]
    ) => Effect.Effect<FormattedRoll['rolls'], InvalidDie>
    readonly fromDispatch: (
      output: any,
      formattedDice: FormattedRoll['rolls'],
      dice: Die[]
    ) => Effect.Effect<RolledDie[], InvalidDie>
  }
>() {}

export const RollFormatterLive = Layer.effect(
  RollFormatter,
  Effect.gen(function* () {
    return {
      toDispatch: (dice: Die[]) =>
        Effect.gen(function* () {
          assert(dice.length > 0)
          const count = 1 as const
          const index = 0

          const { sides } = dice[index]

          if (sides === undefined) {
            return yield* Effect.fail(
              new InvalidDie({ message: 'Die has no sides' })
            )
          }

          const formattedDice = {
            [formatDieKey(index)]: formatDie(count, sides),
            ...formatDiceComponents(dice, index + 1),
          }

          assert(formattedDice['dice-0'] !== undefined)
          return formattedDice
        }),

      fromDispatch: (
        output: DispatchResultsOutput,
        formattedDice: FormattedRoll['rolls'],
        dice: Die[]
      ) =>
        Effect.gen(function* () {
          assert(!!formattedDice)

          type Nom = keyof FormattedRoll['rolls']
          const diceKeys = Object.keys(formattedDice) as Nom[]

          for (const key of diceKeys) {
            // @ts-ignore
            const sides = Number(formattedDice[key].replace('1d', ''))
            if (
              output.results[key].results.result < 1 ||
              output.results[key].results.result > sides
            )
              return yield* Effect.fail(
                new InvalidDie({
                  message: 'Die result is outside the valid range',
                })
              )
          }

          const dieValues = Object.keys(output.results).map((key: any) => {
            return output.results[key].results.result
          })

          if (dieValues.some((value: number) => value < 1)) {
            return yield* Effect.fail(
              new InvalidDie({
                message: 'Die has negative values',
              })
            )
          }

          assert(output.results['dice-0'].results !== undefined)
          return dice.map((die, index) => ({
            sides: die.sides,
            label: die.label,
            value: output.results[formatDieKey(index)].results.result,
          }))
        }),
    }
  })
)

const formatDieKey = (index: number): DieKey => `dice-${index}`
const formatDie = (dieCount: number, sides: number) => `${dieCount}d${sides}`
const formatDiceComponents = (components: DiceComponent[], index = 0) => {
  if (components.length === index) {
    return {}
  }

  const { sides, count = 1 } = components[index]

  return {
    [formatDieKey(index)]: formatDie(count, sides),
    ...formatDiceComponents(components, index + 1),
  }
}

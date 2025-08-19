import { Context, Effect, Layer } from 'effect'
import { challengeDice } from '@/system/rolls/dice'
import { Dispatch, dispatch_live } from '@/system/rolls/dispatch'
import { roll_formatter, roll_formatter_live } from '@/system/rolls/formatter'
import { get_die_by_label } from '@/system/rolls/get_die_by_label'

type ProgressRollResult = {
    outcome: string
    progress: number
    challengeDie1: {
        roll: number
        exceeded: boolean
    }
    challengeDie2: {
        roll: number
        exceeded: boolean
    }
}

class ProgressRollHandler extends Context.Tag('ProgressRollHandler')<
    ProgressRollHandler,
    {
        readonly roll: (progress: number) => Effect.Effect<ProgressRollResult, Error>
    }
>() {}

const progress_roll_handler_live = Layer.effect(
    ProgressRollHandler,
    Effect.gen(function* () {
        const formatter = yield* roll_formatter
        // const rollOutcome = yield* RollOutcome;

        return {
            roll: (progress: number) =>
                Effect.gen(function* () {
                    const rolledDice = yield* formatter.roll(challengeDice)
                    const challengeDie1 = yield* get_die_by_label(rolledDice, 'Challenge Die: 1')
                    const challengeDie2 = yield* get_die_by_label(rolledDice, 'Challenge Die: 2')

                    const outcome = yield* rollOutcome.calculate(
                        progress,
                        challengeDie1,
                        challengeDie2
                    )

                    return {
                        outcome: outcome.outcome,
                        progress: progress,
                        challenge_die_1: {
                            roll: outcome.challengeDie1.value,
                            exceeded: outcome.challengeDie1.exceeded,
                        },
                        challenge_die_2: {
                            roll: outcome.challengeDie2.value,
                            exceeded: outcome.challengeDie2.exceeded,
                        },
                    }
                }),
        }
    })
)

const main_live = progress_roll_handler_live.pipe(
    Layer.provide(roll_formatter_live),
    Layer.provide(dispatch_live)
)

export const roll = (score: number) =>
    Effect.provide(
        Effect.flatMap(ProgressRollHandler, handler => handler.roll(score)),
        main_live
    )

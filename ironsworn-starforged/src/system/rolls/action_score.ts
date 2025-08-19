import { Context, Data, Effect, Layer } from 'effect'
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates'

export class ActionScoreError extends Data.TaggedError('ActionScoreError')<{
    cause?: unknown
    message?: string
}> {}

export class ActionScore extends Context.Tag('ActionScore')<
    ActionScore,
    {
        readonly calculate: (
            dice: DiceComponent[],
            modifier: number,
            momentum: number,
            action_score_preset: number | null
        ) => Effect.Effect<{ action_score_total: number; die_negated: boolean }, ActionScoreError>
    }
>() {}

// TODO: Rewrite using pattern matching given the different inputs
// dice + mod + momentum / preset score / preset + momentum
export const action_score_live = Layer.effect(
    ActionScore,
    Effect.gen(function* () {
        return {
            calculate: (
                dice: DiceComponent[],
                modifier: number,
                momentum: number,
                action_score_preset: number | null = null
            ) => {
                if (action_score_preset !== null) {
                    return Effect.succeed({
                        action_score_total: action_score_preset,
                        die_negated: false,
                    })
                }

                const action_die_result = dice.find(die => die.label === 'Action Die')

                if (!action_die_result) {
                    return Effect.fail(
                        new ActionScoreError({
                            message: 'actionDieResult value is undefined',
                        })
                    )
                }

                if (!action_die_result.value) {
                    return Effect.fail(
                        new ActionScoreError({
                            message: 'actionDieResult has no value',
                        })
                    )
                }

                const action_score_max = 10
                const die_negated = action_die_result.value === -momentum
                const action_score_final = Math.min(
                    (die_negated ? 0 : action_die_result.value) + modifier,
                    action_score_max
                )

                assert(action_score_final <= 10 && action_score_final >= 0)
                return Effect.succeed({
                    action_score_total: action_score_final,
                    die_negated,
                })
            },
        }
    })
)

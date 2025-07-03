import { Console, Context, Effect, Layer } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { sheet_init_values } from '@/external/sync'
import { ActionScore, type ActionScoreError } from '@/system/rolls/action_score'
import { actionDice } from '@/system/rolls/dice'
import { Dispatch, type DispatchError } from '@/system/rolls/dispatch'
import { type InvalidDie, type InvalidDispatch, RollFormatter } from '@/system/rolls/formatter'
import { type DieNotFound, getDieByLabel } from '@/system/rolls/get_die_by_label'
import type { OutcomeActor } from '@/system/rolls/state_machine_calculate_outcome'
import { assert } from '@/utility/assert'

export class ActionRoll extends Context.Tag('ActionRoll')<
    ActionRoll,
    {
        readonly roll: (
            actor: OutcomeActor,
            modifier: number,
            momentum: number,
            rollName: string
        ) => Effect.Effect<
            void,
            | ActionScoreError
            | InvalidDie
            | DieNotFound
            | DispatchError
            | InvalidDispatch
            | ParseError
        >
    }
>() {}

export const ActionRollLive = Layer.effect(
    ActionRoll,
    Effect.gen(function* () {
        const formatter = yield* RollFormatter
        const dispatch = yield* Dispatch
        const action_score = yield* ActionScore

        return {
            roll: (actor, modifier, momentum, rollName) =>
                Effect.gen(function* () {
                    assert(sheet_init_values.character.id !== undefined)

                    const encodedDice = yield* formatter.toDispatch(actionDice)

                    const output = yield* Effect.retry(dispatch.roll(encodedDice), {
                        times: 3,
                    })

                    const decodedDice = yield* formatter.fromDispatch(
                        output,
                        encodedDice,
                        actionDice
                    )

                    const { action_score_total, die_negated } = yield* action_score.calculate(
                        decodedDice,
                        modifier,
                        momentum,
                        null
                    )

                    const { challenge_die_1, challenge_die_2, action_die } = yield* Effect.all({
                        challenge_die_1: getDieByLabel(decodedDice, 'Challenge Die: 1'),
                        challenge_die_2: getDieByLabel(decodedDice, 'Challenge Die: 2'),
                        action_die: getDieByLabel(decodedDice, 'Action Die'),
                    })

                    assert(
                        challenge_die_1.value > 0 &&
                            challenge_die_2.value > 0 &&
                            action_die.value > 0
                    )

                    actor.send({
                        type: 'params',
                        value: {
                            name: rollName,
                            character: {
                                name: sheet_init_values.character.name,
                                id: sheet_init_values.character.id,
                            },
                            challenge_die_1: challenge_die_1.value,
                            challenge_die_2: challenge_die_2.value,
                            actionDie: {
                                value: action_die.value,
                                negated: die_negated,
                            },
                            action_score: action_score_total,
                            momentum: momentum,
                        },
                    })
                }),
        }
    })
)

export const roll = (actor: OutcomeActor, modifier: number, momentum: number, rollName: string) =>
    Effect.flatMap(ActionRoll, actionRoll =>
        actionRoll.roll(actor, modifier, momentum, rollName)
    ).pipe(
        Effect.catchTags({
            ActionScoreError: () => Console.warn('ActionScore Error'),
            InvalidDie: () => Console.warn('InvalidDie Error'),
            DieNotFound: () => Console.warn('DieNotFound Error'),
            DispatchError: () => Console.warn('Dispatch Error'),
            InvalidDispatch: () => Console.warn('InvalidDispatch Error'),
            ParseError: () => Console.warn('Parse Error'),
        })
    )

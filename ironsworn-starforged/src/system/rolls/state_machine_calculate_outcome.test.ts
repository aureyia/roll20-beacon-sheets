import { Effect } from 'effect'
import { describe, expect, test, vi } from 'vitest'
import { createActor } from 'xstate'
import {
    compare,
    get_outcome_key,
    outcomes_save,
    test_outcomes_save,
} from '@/system/rolls/test-helper/snapshots'
import { machine } from './state_machine_calculate_outcome'

const regenerate = process.env.REGENERATE === 'true'

describe('calculate-outcome-machine', () => {
    const outcomes_new = {}

    test('snapshots', async () => {
        for (const l1 in new Array(10).fill(0)) {
            const challenge_die_1 = Number(l1) + 1
            for (const l2 in new Array(10).fill(0)) {
                const challenge_die_2 = Number(l2) + 1
                for (const l3 in new Array(10).fill(0)) {
                    const momentum = Number(l3) + 1
                    for (const l4 in new Array(10).fill(0)) {
                        const action_score = Number(l4) + 1
                        for (const l5 in new Array(2).fill(0)) {
                            const burn = Number(l5) === 0
                            const name = `${challenge_die_1}-${challenge_die_2}-${momentum}-${action_score}-${burn}`

                            const roll_send_to_chat = await import('@/utility/roll_send_to_chat')
                            vi.spyOn(roll_send_to_chat, 'default')
                                // @ts-ignore
                                .mockImplementation(Effect.gen(function* () {}))

                            const actor = createActor(machine)

                            let outcome: string | undefined
                            let burnOutcome = false

                            actor.subscribe(snapshot => {
                                outcome = snapshot.context.outcome_previous
                                const eligibleMatched =
                                    // @ts-ignore
                                    snapshot.matches('Eligible for Opportunity') ||
                                    // @ts-ignore
                                    snapshot.matches('Hitting: Eligible for Strong Hit') ||
                                    // @ts-ignore
                                    snapshot.matches('Missing: Eligible for Strong Hit') ||
                                    // @ts-ignore
                                    snapshot.matches('Eligible for Weak Hit')
                                if (eligibleMatched) {
                                    burnOutcome = burn

                                    actor.send({
                                        type: 'burnChoice',
                                        value: burn,
                                    })
                                }
                            })

                            actor.start()

                            const event_params = {
                                name: name,
                                character: {
                                    name: 'Ayla',
                                    id: 'ABC123',
                                },
                                challenge_die_1: challenge_die_1,
                                challenge_die_2: challenge_die_2,
                                action_die: {
                                    value: 1,
                                    negated: false,
                                },
                                action_score: action_score,
                                momentum: momentum,
                            }

                            actor.send({
                                type: 'params',
                                value: event_params,
                            })

                            const key = get_outcome_key({
                                challenge_die_1,
                                challenge_die_2,
                                momentum,
                                action_score,
                                burn,
                            })

                            const roll_send_to_chatParams: any = {
                                param1: event_params.character.id,
                                data: {
                                    type: 'move-compact',
                                    parameters: {
                                        characterName: event_params.character.name,
                                        title: `Rolling ${event_params.name}`,
                                        dice: {
                                            challenge_die_1: event_params.challenge_die_1,
                                            challenge_die_2: event_params.challenge_die_2,
                                            action_die: event_params.action_die,
                                        },
                                        outcome: outcome,
                                        score: event_params.action_score,
                                        burnedMomentum: burnOutcome,
                                    },
                                },
                            }

                            // @ts-ignore
                            outcomes_new[key] = roll_send_to_chatParams

                            actor.stop()
                        }
                    }
                }
            }
        }

        if (regenerate) {
            outcomes_save(outcomes_new)
        } else {
            test_outcomes_save(outcomes_new)
            const result = compare()
            expect(result).toEqual('No differences found.')
        }
    })
})

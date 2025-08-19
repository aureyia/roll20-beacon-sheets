import { Effect } from 'effect'
import { type ActorRefFrom, assertEvent, setup } from 'xstate'
import { assert } from '@/utility/assert'
import roll_send_to_chat from '@/utility/roll_send_to_chat'

type Outcome = 'opportunity' | 'strong-hit' | 'weak-hit' | 'miss' | 'complication'

export type OutcomeActor = ActorRefFrom<typeof machine>
export const machine = setup({
    types: {
        context: {} as {
            momentum_burned: boolean
            name?: string
            challenge_die_1?: number
            challenge_die_2?: number
            action_score?: number
            action_die: {
                value?: number
                negated?: boolean
            }
            momentum?: number
            character: {
                name: string
                id: string
            }
            outcome_previous: string
        },
        events: {} as
            | {
                  type: 'burnChoice'
                  value: boolean
              }
            | {
                  type: 'params'
                  value: {
                      character: {
                          name: string
                          id: string
                      }
                      name: string
                      action_die: {
                          value: number
                          negated: boolean
                      }
                      challenge_die_1: number
                      challenge_die_2: number
                      action_score: number
                      momentum: number
                  }
              },
    },
    actions: {
        momentum_reset: ({ context, event }, params) => {
            context.momentum_burned = true
        },
        params_save_to_context: ({ context, event }, params) => {
            assertEvent(event, 'params')
            context.action_die.value = event.value.action_die.value
            context.action_die.negated = event.value.action_die.negated
            context.action_score = event.value.action_score
            context.challenge_die_1 = event.value.challenge_die_1
            context.challenge_die_2 = event.value.challenge_die_2
            context.momentum = event.value.momentum
            context.name = event.value.name
            context.character.name = event.value.character.name
            context.character.id = event.value.character.id
        },
        outcome_send_to_chat: async ({ context }, params: { outcome: Outcome }) => {
            if (
                !context.name ||
                context.action_score === undefined ||
                !context.challenge_die_1 ||
                !context.challenge_die_2 ||
                !context.action_die.value ||
                context.action_die.negated === undefined ||
                context.character.id === '' ||
                context.character.name === ''
            ) {
                const context_error = JSON.stringify(context)
                throw new Error(`Missing context for outcome_send_to_chat ${context_error}`)
            }
            context.outcome_previous = params.outcome
            assert(params.outcome !== null)
            Effect.runPromise(
                roll_send_to_chat(context.character.id, {
                    type: 'move_compact',
                    parameters: {
                        character_name: context.character.name,
                        title: `Rolling ${context.name}`,
                        dice: {
                            challenge_die_1: context.challenge_die_1,
                            challenge_die_2: context.challenge_die_2,
                            action_die: {
                                value: context.action_die.value,
                                negated: context.action_die.negated,
                            },
                        },
                        outcome: params.outcome,
                        score: context.action_score,
                        momentum_burned: context.momentum_burned,
                    },
                })
            )
            context.momentum_burned = false
        },
    },
    guards: {
        challenge_dice_match: ({ context }) => context.challenge_die_1 === context.challenge_die_2,
        exceeds_both: ({ context }) => {
            if (
                context.action_score === undefined ||
                !context.challenge_die_1 ||
                !context.challenge_die_2
            ) {
                throw new Error('Missing context for outcome_send_to_chat')
            }

            return (
                context.action_score > context.challenge_die_1 &&
                context.action_score > context.challenge_die_2
            )
        },
        momentum_exceeds_both: ({ context }) => {
            if (
                context.momentum === undefined ||
                !context.challenge_die_1 ||
                !context.challenge_die_2
            ) {
                throw new Error('Missing context for momentum_exceeds_both')
            }

            return (
                context.momentum > context.challenge_die_1 &&
                context.momentum > context.challenge_die_2
            )
        },
        chose_to_burn: ({ event }) => {
            assertEvent(event, 'burnChoice')
            return event.value
        },
        exceeds_one: ({ context }) => {
            if (
                context.action_score === undefined ||
                !context.challenge_die_1 ||
                !context.challenge_die_2
            ) {
                throw new Error('Missing context for exceeds_one')
            }

            return (
                context.action_score > context.challenge_die_1 ||
                context.action_score > context.challenge_die_2
            )
        },
        momentum_exceeds_one: ({ context }) => {
            if (
                context.momentum === undefined ||
                !context.challenge_die_1 ||
                !context.challenge_die_2
            ) {
                throw new Error('Missing context for momentum_exceeds_one')
            }

            return (
                context.momentum > context.challenge_die_1 ||
                context.momentum > context.challenge_die_2
            )
        },
    },
}).createMachine({
    context: {
        momentum_burned: false,
        outcome_previous: '',
        action_die: {},
        character: {
            name: '',
            id: '',
        },
    },
    id: 'calculateOutcome',
    initial: 'waiting for params',
    states: {
        'waiting for params': {
            on: {
                params: {
                    target: 'calculating',
                    actions: {
                        type: 'params_save_to_context',
                    },
                },
            },
        },
        calculating: {
            always: [
                {
                    target: 'Matched',
                    guard: {
                        type: 'challenge_dice_match',
                    },
                },
                {
                    target: 'Not Matched',
                },
            ],
        },
        Matched: {
            always: [
                {
                    target: 'Opportunity',
                    guard: {
                        type: 'exceeds_both',
                    },
                },
                {
                    target: 'Eligible for Opportunity',
                    guard: {
                        type: 'momentum_exceeds_both',
                    },
                },
                {
                    target: 'Complication',
                },
            ],
        },
        'Not Matched': {
            always: [
                {
                    target: 'Strong Hit',
                    guard: {
                        type: 'exceeds_both',
                    },
                },
                {
                    target: 'Hitting',
                    guard: {
                        type: 'exceeds_one',
                    },
                },
                {
                    target: 'Missing',
                },
            ],
        },
        Opportunity: {
            always: {
                target: 'waiting for params',
            },
            exit: {
                type: 'outcome_send_to_chat',
                params: {
                    outcome: 'opportunity',
                },
            },
        },
        'Eligible for Opportunity': {
            on: {
                burnChoice: [
                    {
                        target: 'Opportunity',
                        actions: {
                            type: 'momentum_reset',
                        },
                        guard: {
                            type: 'chose_to_burn',
                        },
                    },
                    {
                        target: 'Complication',
                    },
                ],
            },
        },
        Complication: {
            always: {
                target: 'waiting for params',
            },
            exit: {
                type: 'outcome_send_to_chat',
                params: {
                    outcome: 'complication',
                },
            },
        },
        'Strong Hit': {
            always: {
                target: 'waiting for params',
            },
            exit: {
                type: 'outcome_send_to_chat',
                params: {
                    outcome: 'strong-hit',
                },
            },
        },
        Hitting: {
            always: [
                {
                    target: 'Hitting: Eligible for Strong Hit',
                    guard: {
                        type: 'momentum_exceeds_both',
                    },
                },
                {
                    target: 'Weak Hit',
                },
            ],
        },
        Missing: {
            always: [
                {
                    target: 'Missing: Eligible for Strong Hit',
                    guard: {
                        type: 'momentum_exceeds_both',
                    },
                },
                {
                    target: 'Eligible for Weak Hit',
                    guard: {
                        type: 'momentum_exceeds_one',
                    },
                },
                {
                    target: 'Miss',
                },
            ],
        },
        'Hitting: Eligible for Strong Hit': {
            on: {
                burnChoice: [
                    {
                        target: 'Strong Hit',
                        actions: {
                            type: 'momentum_reset',
                        },
                        guard: {
                            type: 'chose_to_burn',
                        },
                    },
                    {
                        target: 'Weak Hit',
                    },
                ],
            },
        },
        'Weak Hit': {
            always: {
                target: 'waiting for params',
            },
            exit: {
                type: 'outcome_send_to_chat',
                params: {
                    outcome: 'weak-hit',
                },
            },
        },
        'Missing: Eligible for Strong Hit': {
            on: {
                burnChoice: [
                    {
                        target: 'Strong Hit',
                        actions: {
                            type: 'momentum_reset',
                        },
                        guard: {
                            type: 'chose_to_burn',
                        },
                    },
                    {
                        target: 'Miss',
                    },
                ],
            },
        },
        'Eligible for Weak Hit': {
            on: {
                burnChoice: [
                    {
                        target: 'Weak Hit',
                        actions: {
                            type: 'momentum_reset',
                        },
                        guard: {
                            type: 'chose_to_burn',
                        },
                    },
                    {
                        target: 'Miss',
                    },
                ],
            },
        },
        Miss: {
            always: {
                target: 'waiting for params',
            },
            exit: {
                type: 'outcome_send_to_chat',
                params: {
                    outcome: 'miss',
                },
            },
        },
    },
})

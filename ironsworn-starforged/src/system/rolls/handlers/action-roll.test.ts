import { Effect, Layer } from 'effect'
import { describe, expect, test, vi } from 'vitest'
import { createActor } from 'xstate'
import { roll as actionRoll } from '@/system/rolls/handlers/action-roll'
import * as exports from '@/utility/send-roll-to-chat'
import { ActionScoreLive } from '../action-score'
import type { DispatchResultsOutput } from '../dispatch'
import { Dispatch } from '../dispatch'
import { RollFormatterLive } from '../formatter'
import { machine } from '../machines/calculate-outcome'
import { ActionRollLive } from './action-roll'

const rollResults = {}

const DispatchTest = Layer.succeed(Dispatch, {
  roll: _dice => Effect.succeed(rollResults as DispatchResultsOutput),
})

const MainTest = ActionRollLive.pipe(
  Layer.provide(ActionScoreLive),
  Layer.provide(RollFormatterLive),
  Layer.provide(DispatchTest)
)

describe('ActionRoll', () => {
  test('nom', () => {
    const sendRollToChat = vi
      .spyOn(exports, 'sendRollToChat')
      .mockImplementation(async () => {})

    const actor = createActor(machine)

    actor.subscribe(snapshot => {
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
        actor.send({ type: 'burnChoice', value: true })
      }
    })

    Effect.runPromise(
      actionRoll(actor, 2, 2, 'test').pipe(Effect.provide(MainTest))
    ).then(() => {
      expect(sendRollToChat)
    })

    actor.stop()
  })
})

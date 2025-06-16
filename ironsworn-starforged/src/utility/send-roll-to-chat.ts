import {
  createRollTemplate,
  type AnyRollTemplate,
} from '@/system/rolls/rolltemplates/rolltemplates'
import { dispatchRef } from '@/external/vue.relay'
import type { Dispatch, PostArgs } from '@roll20-official/beacon-sdk'
import { Effect } from 'effect'
import { DispatchError } from '@/system/rolls/dispatch'

export const sendRollToChat = (
  id: PostArgs['characterId'],
  params: AnyRollTemplate,
  options = {}
) =>
  Effect.gen(function* () {
    const dispatch = dispatchRef.value as Dispatch
    const rollTemplate = createRollTemplate(params)

    if (id === undefined) {
      return yield* Effect.fail(new Error('No character id was provided'))
    }

    yield* Effect.tryPromise({
      try: () =>
        dispatch.post({
          characterId: id,
          content: rollTemplate,
          options,
        }),
      catch: e =>
        new DispatchError({
          message: 'Sending roll to chat failed',
          cause: e,
        }),
    })
  })

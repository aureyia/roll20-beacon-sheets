import type { Dispatch, PostArgs } from '@roll20-official/beacon-sdk'
import { Effect } from 'effect'
import { dispatch_ref } from '@/external/vue.relay'
import { DispatchError } from '@/system/rolls/dispatch'
import {
    type AnyRollTemplate,
    roll_template_create,
} from '@/system/rolls/rolltemplates/rolltemplates'

export default (id: PostArgs['characterId'], params: AnyRollTemplate, options = {}) =>
    Effect.gen(function* () {
        const dispatch = dispatch_ref.value as Dispatch
        const roll_template = roll_template_create(params)

        if (id === undefined) {
            return yield* Effect.fail(new Error('No character id was provided'))
        }

        yield* Effect.tryPromise({
            try: () =>
                dispatch.post({
                    characterId: id,
                    content: roll_template,
                    options,
                }),
            catch: e =>
                new DispatchError({
                    message: 'Sending roll to chat failed',
                    cause: e,
                }),
        })
    })

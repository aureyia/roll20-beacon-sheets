import { Context, Data, Effect, Layer, Predicate, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { dispatch_ref } from '@/external/vue.relay'
import { assert } from '@/utility/assert'
import { type DispatchResults, DispatchResultsSchema } from './dispatch.schema'

type AvailableDice = '1d6' | '1d10' | '1d100'
export type DispatchResultsOutput = { results: DispatchResults }

export type FormattedRoll = {
    rolls: {
        'dice-0'?: AvailableDice
        'dice-1'?: AvailableDice
        'dice-2'?: AvailableDice
    }
}

export class DispatchError extends Data.TaggedError('DispatchError')<{
    cause?: unknown
    message?: string
}> {}

export class Dispatch extends Context.Tag('Dispatch')<
    Dispatch,
    {
        readonly roll: (
            dice: FormattedRoll['rolls']
        ) => Effect.Effect<DispatchResultsOutput, DispatchError | ParseError>
    }
>() {}

export const dispatch_live = Layer.effect(
    Dispatch,
    Effect.gen(function* () {
        return {
            roll: dice =>
                Effect.gen(function* () {
                    assert(Object.keys(dice).length > 0)

                    const dispatchResult = yield* Effect.tryPromise({
                        try: () =>
                            dispatch_ref.value.roll({
                                rolls: dice,
                            }),
                        catch: e =>
                            new DispatchError({
                                cause: e,
                                message: 'Dispatch roll failed.',
                            }),
                    })

                    const { ...results } =
                        yield* Schema.decodeUnknown(DispatchResultsSchema)(dispatchResult)

                    if (Predicate.isUndefined(results.results['dice-0'])) {
                        return yield* new DispatchError({
                            message: 'Dispatch returned no results',
                        })
                    }

                    assert(Object.keys(results.results).length > 0)
                    return results
                }),
        }
    })
)

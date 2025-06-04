import { Effect, Context, Layer, Data, Schema } from 'effect';
import { dispatchRef } from '@/external/vue.relay';
import { DispatchResultsSchema, type DispatchResults } from './dispatch.schema';
import { assert } from '@/utility/assert';
import { ParseError } from 'effect/ParseResult';

type AvailableDice = '1d6' | '1d10' | '1d100';
export type DispatchResultsOutput = { results: DispatchResults}

export type FormattedRoll = {
  rolls: {
    'dice-0'?: AvailableDice;
    'dice-1'?: AvailableDice;
    'dice-2'?: AvailableDice;
  };
};

export class DispatchError extends Data.TaggedError('DispatchError')<{
  cause?: unknown;
  message?: string;
}> {}

export class Dispatch extends Context.Tag('Dispatch')<
  Dispatch,
  {
    readonly roll: (
      dice: FormattedRoll['rolls'],
    ) => Effect.Effect<DispatchResultsOutput, DispatchError | ParseError >;
  }
>() {}

export const DispatchLive = Layer.effect(
  Dispatch,
  Effect.gen(function* () {
    return {
      roll: (dice) =>
        Effect.gen(function* () {
          assert(Object.keys(dice).length > 0);

          const dispatchResult = yield* Effect.tryPromise({
            try: () =>
              dispatchRef.value.roll({
                rolls: dice,
              }),
            catch: (e) =>
              new DispatchError({
                cause: e,
                message: 'Dispatch roll failed.',
              }),
          });

          const { rawResults, ...results } = yield* Schema.decodeUnknown(
            DispatchResultsSchema,
          )(dispatchResult);

          assert(Object.keys(results.results).length > 0);
          return results;
        }),
    };
  }),
);



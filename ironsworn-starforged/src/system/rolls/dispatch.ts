import {
  Effect,
  Context,
  Layer,
  Data,
  Schema,
  Predicate,
  Either,
} from 'effect';
import { dispatchRef } from '@/external/vue.relay';
import { DispatchResultsSchema, type DispatchResults } from './dispatch.schema';
import { assert } from '@/utility/assert';
import { ParseError } from 'effect/ParseResult';

type AvailableDice = '1d6' | '1d10' | '1d100';
export type DispatchResultsOutput = { results: DispatchResults };

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

// # Dependency Injection 4
export class Dispatch extends Context.Tag('Dispatch')<
  Dispatch,
  {
    readonly roll: (
      dice: FormattedRoll['rolls'],
    ) => Effect.Effect<DispatchResultsOutput, DispatchError | ParseError>;
  }
>() {}

export const DispatchLive = Layer.effect(
  Dispatch,
  //@ts-ignore
  Effect.gen(function* () {
    return {
      roll: (dice) =>
        Effect.gen(function* () {
          // Design By Contract 1
          assert(Object.keys(dice).length > 0);

          // # Error Handling 1

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

          // # Error Handling 2

          const dispatchResult2 = yield* Effect.either(Effect.tryPromise({
            try: () =>
              dispatchRef.value.roll({
                rolls: dice,
              }),
            catch: (e) =>
              new DispatchError({
                cause: e,
                message: 'Dispatch roll failed.',
              }),
          }));

          if (Either.isLeft(dispatchResult2)) {

            console.log('I handled it')
          
          } else {
           
            const success = dispatchResult2.right
          
          }

          // Schema and Decoding

          const { rawResults, ...results } = yield* Schema.decodeUnknown(
            DispatchResultsSchema,
          )(dispatchResult);

          if (Predicate.isUndefined(results.results['dice-0'])) {
            yield* new DispatchError({
              message: 'Dispatch returned no results',
            });
          }

          // Design By Contract 2
          assert(Object.keys(results.results).length > 0);
          return results;
        }),
    };
  }),
);

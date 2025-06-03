import { Effect, Context, Layer, Data, Schema } from 'effect';
import { dispatchRef } from '@/external/vue.relay';
import type { Dispatch as DispatchType } from '@roll20-official/beacon-sdk';
import { DispatchResultsSchema } from './dispatch.schema';

type AvailableDice = '1d6' | '1d10' | '1d100';

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
    ) => Effect.Effect<unknown, DispatchError>;
  }
>() {}

export const DispatchLive = Layer.effect(
  Dispatch,
  Effect.gen(function* () {
    return {
      roll: async (dice) =>
        Effect.gen(function* () {
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

          const { rawResults, ...results } = dispatchResult

          console.log(Schema.decodeUnknownSync(DispatchResultsSchema)(results))

          return Effect.succeed(results);
        }),
    };
  }),
);

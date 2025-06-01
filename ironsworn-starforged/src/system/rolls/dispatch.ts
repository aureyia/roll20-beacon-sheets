import { Effect, Context, Layer, Data } from 'effect';
import { dispatchRef } from '@/external/vue.relay';

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
      roll: (dice) =>
        Effect.gen(function* () {
          (async () => {
            console.log(await dispatchRef.value.roll({ rolls: dice }));
          })();
          return yield* Effect.tryPromise({
            try: () => dispatchRef.value.roll({ rolls: dice }),
            catch: (e) =>
              new DispatchError({
                cause: e,
                message: 'Dispatch roll failed.',
              }),
          });
        }),
    };
  }),
);

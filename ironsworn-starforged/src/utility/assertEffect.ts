import { Effect, Data } from 'effect';

export class assertEffect extends Data.TaggedError('assertEffect')<{
  message: string;
  cause: any;
}> {}

export const assertEffect = (predicate: boolean, context: any) => {
  if (!predicate) {
    return Effect.runSync(
      Effect.die(
        new assertEffect({
          message: `Assertion failed. ${context}`,
          cause: context,
        }),
      ),
    );
  }
};

export const maybe = (predicate: boolean, context = null): void => {
  assertEffect(predicate || !predicate, context);
};

import { Effect, Data } from 'effect';

export class assert extends Data.TaggedError('assert')<{
  message: string;
  cause: any;
}> {}

export const assert = (predicate: boolean, context: any) => {
  if (!predicate) {
    return Effect.runSync(
      Effect.die(
        new assert({
          message: `Assertion failed. ${context}`,
          cause: context,
        }),
      ),
    );
  }
};

export const maybe = (predicate: boolean, context = null): void => {
  assert(predicate || !predicate, context);
};

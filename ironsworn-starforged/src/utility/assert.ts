import { Effect, Data } from 'effect';

export class Assert extends Data.TaggedError('Assert')<{
  message: string;
  context: any;
}> {}

export const assert = (predicate: boolean, context: any) => {
  if (!predicate) {
    return Effect.fail(
      new Assert({
        message: 'Assertion failed.',
        context: context,
      }),
    );
  }
};

export const maybe = (predicate: boolean, context = null): void => {
  assert(predicate || !predicate, context);
};

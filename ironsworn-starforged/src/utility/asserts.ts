import { Effect, Data } from 'effect';

export class Asserts extends Data.TaggedError('Asserts')<{
  message: string;
  cause: any;
}> {}

export const asserts = (predicate: boolean, context: any) => {
  if (!predicate) {
    return Effect.runSync(
      Effect.die(
        new Asserts({
          message: `Assertion failed. ${context}`,
          cause: context,
        }),
      ),
    );
  }
};

export const maybe = (predicate: boolean, context = null): void => {
  asserts(predicate || !predicate, context);
};

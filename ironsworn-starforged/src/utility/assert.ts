import { Data } from 'effect';

export class Assert extends Data.TaggedError('assert')<{ message: string }> {}
export const assert = (predicate: boolean) => {
  if (!predicate) throw new Assert({ message: `Assertion failed.` });
};

export const maybe = (predicate: boolean): void => {
  assert(predicate || !predicate);
};

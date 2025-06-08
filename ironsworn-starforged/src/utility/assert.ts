import { Data } from 'effect';

export class Assert extends Data.TaggedError('Assert')<{
  message: string;
  context?: any;
}> {}
export const assert = (predicate: boolean, context = null) => {
  if (!predicate) {
    console.error('Assert threw!');
    throw new Assert({ message: `Assertion failed.`, context });
  }
};

export const maybe = (predicate: boolean): void => {
  assert(predicate || !predicate);
};

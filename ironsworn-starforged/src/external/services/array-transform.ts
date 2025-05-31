import { Effect, Context, Data, Layer, Array } from 'effect';

class ArrayTransformError extends Data.TaggedError('ArrayTransformError')<{
  cause: Object;
  message: string;
}> {}

export class ArrayTransform extends Context.Tag('ArrayTransform')<
  ArrayTransform,
  {
    readonly arrayToObject: (
      array: [],
    ) =>
      | Effect.Effect<Record<string, any>>
      | Effect.Effect<never, ArrayTransformError>;
  }
>() {}

export const ArrayTransformLive = Layer.effect(
  ArrayTransform,
  Effect.gen(function* () {
    return {
      arrayToObject: (array) => {
        if (!Array.isArray(array)) {
          return Effect.fail(
            new ArrayTransformError({
              cause: array,
              message:
                'Tried to objectify an array, but not every item had ids',
            }),
          );
        }
        const newObject: Record<string, any> = {};
        array.forEach((item, index) => {
          //@ts-ignore
          const { _id, ...rest } = item;
          newObject[_id] = {
            ...rest,
            arrayPosition: index,
          };
        });
        return Effect.succeed(newObject);
      },
    };
  }),
);

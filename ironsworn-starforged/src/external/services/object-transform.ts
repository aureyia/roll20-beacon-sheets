import { Effect, Context, Data, Layer } from 'effect';

class ObjectTransformError extends Data.TaggedError('ObjectTransformError')<{
  cause: [];
  message: string;
}> {}

export class ObjectTransform extends Context.Tag('ArrayTransform')<
  ObjectTransform,
  {
    readonly objectToArray: (
      array: [],
    ) => Effect.Effect<any [] | ObjectTransformError>;
  }
>() {}

export const ObjectTransformLive = Layer.effect(
  ObjectTransform,
  Effect.gen(function* () {
    return {
      objectToArray: (object: Record<string, any>) =>
        Effect.sync(() => {
          if (!object) return [];

          const newArray: any[] = [];
          const objectIds = Object.keys(object) as (keyof typeof object)[];

          objectIds.forEach((key) => {
            if (object[key]) {
              const position = object[key].arrayPosition;
              const item = {
                _id: key,
                ...object[key],
                arrayPosition: undefined,
              };
              newArray[position] = item;
            }
          });

          // Remove all undefined values in case of deletes
          return newArray.filter((x) => x);
        }),
    };
  }),
);

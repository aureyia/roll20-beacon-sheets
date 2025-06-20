import { Context, Data, Effect, Layer } from 'effect'

class ArrayTransformError extends Data.TaggedError('ArrayTransformError')<{
    // biome-ignore lint: Intentional any
    cause: any
    message: string
}> {}

export class ArrayTransform extends Context.Tag('ArrayTransform')<
    ArrayTransform,
    {
        readonly array_to_object: (
            array: []
        ) => Effect.Effect<Record<string, any>> | Effect.Effect<never, ArrayTransformError> // biome-ignore lint: Intentional any
    }
>() {}

export const ArrayTransformLive = Layer.effect(
    ArrayTransform,
    Effect.gen(function* () {
        return {
            array_to_object: array => {
                if (!Array.isArray(array)) {
                    return Effect.fail(
                        new ArrayTransformError({
                            cause: array,
                            message: 'Tried to objectify an array, but not every item had ids',
                        })
                    )
                }
                // biome-ignore lint: Intentional any
                const newObject: Record<string, any> = {}
                array.forEach((item, index) => {
                    //@ts-ignore
                    const { _id, ...rest } = item
                    newObject[_id] = {
                        ...rest,
                        arrayPosition: index,
                    }
                })
                return Effect.succeed(newObject)
            },
        }
    })
)

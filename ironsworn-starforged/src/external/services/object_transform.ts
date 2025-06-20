import { Context, Data, Effect, Layer } from 'effect'

class ObjectTransformError extends Data.TaggedError('ObjectTransformError')<{
    cause: []
    message: string
}> {}

export class ObjectTransform extends Context.Tag('ArrayTransform')<
    ObjectTransform,
    {
        readonly object_to_array: (array: []) => Effect.Effect<any[] | ObjectTransformError>
    }
>() {}

export const ObjectTransformLive = Layer.effect(
    ObjectTransform,
    Effect.gen(function* () {
        return {
            // biome-ignore lint: Intentional any
            object_to_array: (object: Record<string, any>) =>
                Effect.sync(() => {
                    if (!object) return []

                    // biome-ignore lint: Intentional any
                    const newArray: any[] = []
                    const objectIds = Object.keys(object) as (keyof typeof object)[]

                    for (const key of objectIds) {
                        if (object[key]) {
                            const position = object[key].arrayPosition
                            const item = {
                                _id: key,
                                ...object[key],
                                arrayPosition: undefined,
                            }
                            newArray[position] = item
                        }
                    }

                    // Remove all undefined values in case of deletes
                    return newArray.filter(x => x)
                }),
        }
    })
)

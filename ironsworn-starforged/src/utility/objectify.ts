import { Effect } from 'effect'

// biome-ignore lint: Intentional any
export const array_to_object = (array: { _id: string; [x: string]: any }[]) => {
    const is_valid_array = array.every(item => {
        return '_id' in item
    })

    if (!is_valid_array)
        Effect.fail(new Error('Tried to objectify an array, but not every item had ids'))

    // biome-ignore lint: Intentional any
    const object_new: Record<string, any> = {}

    array.forEach((item, index) => {
        const { _id, ...rest } = item
        object_new[_id] = {
            ...rest,
            position: index,
        }
    })

    return Effect.succeed(object_new)
}

// biome-ignore lint: Intentional any
export const object_to_array = (object: Record<string, any>) =>
    Effect.sync(() => {
        if (!object) return []
        // biome-ignore lint: Intentional any
        const array_new: any[] = []
        const ids = Object.keys(object) as (keyof typeof object)[]

        for (const key of ids) {
            if (object[key]) {
                const position = object[key].position
                const item = {
                    _id: key,
                    ...object[key],
                    position: undefined,
                }
                array_new[position] = item
            }
        }

        // Remove all undefined values in case of deletes
        return array_new.filter(x => x)
    })

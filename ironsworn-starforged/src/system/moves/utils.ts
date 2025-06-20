import { Data, Effect } from 'effect'
import { starforged } from '@/vendor/dataforged'
import type { IMoveCategory } from '@/vendor/dataforged/dist/types'

export class MoveError extends Data.TaggedError('MoveError')<{
    message?: string
}> {}

export const get_all_moves_in_category = (move_id: string, categories: IMoveCategory[]) =>
    Effect.gen(function* () {
        const category_id = move_id.split('/').slice(0, 3).join('/')
        const category_move = categories.find(category => category.$id === category_id)

        if (!category_move) {
            return yield* Effect.fail(
                new MoveError({
                    message: `No Move Category was found for: ${category_id}`,
                })
            )
        }

        return category_move.Moves
    })

export const get_move_data = (move_id: string) => {
    const category_id = move_id.split('/').slice(0, 3).join('/')
    const category_move = starforged['Move Categories'].find(
        category => category.$id === category_id
    )

    if (!category_move) {
        return Effect.fail(new Error(`\n No Move Category was found for: ${move_id}`))
    }

    const dfMove = category_move.Moves.find(move => move.$id === move_id)

    if (!dfMove) {
        return Effect.fail(new Error(`No Move found for Category: ${move_id}`))
    }

    return Effect.succeed(dfMove)
}

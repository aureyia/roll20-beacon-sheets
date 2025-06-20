import { Effect } from 'effect'
import { starforged } from '@/vendor/dataforged'

export const get_move_data = (move_id: string) => {
    const category_id = move_id.split('/').slice(0, 3).join('/')
    const category_move = starforged['Move Categories'].find(
        category => category.$id === category_id
    )

    if (!category_move) {
        return Effect.fail(new Error(`\n No Move Category was found for: ${move_id}`))
    }

    const move = category_move.Moves.find(move => move.$id === move_id)

    if (!move) {
        return Effect.fail(new Error(`No Move found for Category: ${move_id}`))
    }

    return Effect.succeed(move)
}

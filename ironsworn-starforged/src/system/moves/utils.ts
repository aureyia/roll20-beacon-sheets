import { Data, Effect } from 'effect'
import type { IMoveCategory } from '@/vendor/dataforged/dist/types'
import { starforged } from '@/vendor/dataforged'

export class MoveError extends Data.TaggedError('MoveError')<{
  message?: string
}> {}

export const allMovesInCategory = (
  moveId: string,
  categories: IMoveCategory[]
) =>
  Effect.gen(function* () {
    const categoryId = moveId.split('/').slice(0, 3).join('/')
    const dfMoveCategory = categories.find(
      category => category.$id === categoryId
    )

    if (!dfMoveCategory) {
      return yield* Effect.fail(
        new MoveError({
          message: `No Move Category was found for: ${categoryId}`,
        })
      )
    }

    return dfMoveCategory.Moves
  })

export const getMoveData = (moveId: string) => {
  const categoryId = moveId.split('/').slice(0, 3).join('/')
  const dfMoveCategory = starforged['Move Categories'].find(
    category => category.$id === categoryId
  )

  if (!dfMoveCategory) {
    return Effect.fail(
      new Error(`\n No Move Category was found for: ${moveId}`)
    )
  }

  const dfMove = dfMoveCategory.Moves.find(move => move.$id === moveId)

  if (!dfMove) {
    return Effect.fail(new Error(`No Move found for Category: ${moveId}`))
  }

  return Effect.succeed(dfMove)
}

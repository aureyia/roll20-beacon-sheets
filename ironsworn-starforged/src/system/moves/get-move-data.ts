import { starforged } from '@/vendor/dataforged'
import { Effect } from 'effect'

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

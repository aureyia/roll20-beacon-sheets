import { Data, Effect } from 'effect';
import type { IMoveCategory } from '@/vendor/dataforged/dist/types';

export class MoveError extends Data.TaggedError('MoveError')<{
  message?: string;
}> {}

export const allMovesInCategory = (
  moveId: string,
  categories: IMoveCategory[],
) =>
  Effect.gen(function* () {
    const categoryId = moveId.split('/').slice(0, 3).join('/');
    const dfMoveCategory = categories.find(
      (category) => category.$id === categoryId,
    );

    if (!dfMoveCategory) {
      return yield* Effect.fail(
        new MoveError({
          message: `No Move Category was found for: ${categoryId}`,
        }),
      );
    }

    return dfMoveCategory.Moves;
  });

<script setup lang="ts">
import { inject } from 'vue';
import { starforged } from 'dataforged';
import { Effect } from 'effect';
import { useRouter } from 'vue-router';

// @ts-ignore
const { activeMove, updateActiveMove, clearActiveMove } = inject('move')
const router = useRouter()

const getAllCategoryMoves = (moveId: string) => {
  const categoryId = moveId.split('/').slice(0, 3).join('/')
  const dfMoveCategory = starforged['Move Categories'].find((category) => category.$id === categoryId)

  if (!dfMoveCategory) {
    return Effect.fail(new Error (`No Move Category was found for: ${categoryId}`))
  }

  return Effect.succeed(dfMoveCategory.Moves)
}

</script>

<template>
  <div>
    <Button @click="clearActiveMove()">Back</Button>
    <div class="move-search">
      TODO: Search
    </div>
    <div class="move-list">
      <Button
        class="w-full mb-2"
        v-for="move in Effect.runSync(getAllCategoryMoves(activeMove))" 
        @click="updateActiveMove(move.$id)"
        >{{ move.Display.Title }}</Button>
      
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { starforged } from '@/vendor/dataforged'
import { Effect } from 'effect'
import { allMovesInCategory } from '@/system/moves/utils'

// @ts-ignore
const { activeMove, updateActiveMove, clearActiveMove } = inject('move')
</script>

<template>
  <div>
    <Button @click="clearActiveMove()">Back</Button>
    <div class="move-search">TODO: Search</div>
    <div class="move-list">
      <Button
        class="mb-2 w-full"
        v-for="move in Effect.runSync(
          allMovesInCategory(activeMove, starforged['Move Categories']),
        )"
        @click="updateActiveMove(move.$id)"
        >{{ move.Display.Title }}</Button
      >
    </div>
  </div>
</template>

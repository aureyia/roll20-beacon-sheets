<script setup lang="ts">
import { inject } from 'vue'
import { starforged } from '@/vendor/dataforged'
import { Effect } from 'effect'
import { get_all_moves_in_category } from '@/system/moves_utils'

// @ts-ignore
const { active_move, update_active_move, clear_active_move } = inject('move')
</script>

<template>
  <div>
    <Button @click="clear_active_move()">Back</Button>
    <div class="move-search">TODO: Search</div>
    <div class="move-list">
      <Button
        class="mb-2 w-full"
        v-for="move in Effect.runSync(
          get_all_moves_in_category(active_move, starforged['Move Categories']),
        )"
        @click="update_active_move(move.$id)"
        >{{ move.Display.Title }}</Button
      >
    </div>
  </div>
</template>

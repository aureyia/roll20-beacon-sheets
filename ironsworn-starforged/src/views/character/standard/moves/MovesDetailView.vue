<script setup lang="ts">
import {
    MoveActiveCard,
    MoveAssetControl,
    MoveSelect,
} from '@/components/moves'
import { inject, computed, ref, provide, onMounted, onUnmounted } from 'vue'
import { machine } from '@/system/rolls/machines/calculate-outcome'
import { createActor } from 'xstate'

const { activeMove }: any = inject('move')

const actor = createActor(machine)
const moveMode = ref('content')

provide('roll', {
    moveMode,
    actor,
})

onMounted(() => {
    actor.subscribe(snapshot => {
        const matched =
            snapshot.matches('Eligible for Opportunity') ||
            snapshot.matches('Hitting: Eligible for Strong Hit') ||
            snapshot.matches('Missing: Eligible for Strong Hit') ||
            snapshot.matches('Eligible for Weak Hit')

        moveMode.value = matched ? 'momentumBurn' : 'content'
    })

    actor.start()
    console.log('Rolling: Actor Started')
})

onUnmounted(() => {
    actor.stop()
    console.log('Rolling: Actor Stopped')
})

const categoryClass = computed(() =>
    activeMove.value.split('/')[2].toLowerCase().replaceAll('_', '-')
)
</script>

<template>
  <div class="move-details mx-10 flex flex-row gap-10" :class="categoryClass">
    <div class="move-select basis-1/4">
      <MoveSelect />
    </div>
    <div class="active-move basis-1/2">
      <MoveActiveCard :moveMode="moveMode" />
    </div>
    <div class="assets-control basis-1/4">
      <!-- <MoveAssetControl /> -->
    </div>
  </div>
</template>

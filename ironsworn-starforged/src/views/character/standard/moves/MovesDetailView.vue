<script setup lang="ts">
import { MoveActiveCard, MoveAssetControl, MoveSelect, MoveRollOptionsCard } from '@/components/moves';
import { inject, computed, ref, provide } from 'vue';

const rollMode = ref(false);
const { activeMove }: any = inject('move');

provide('roll', {
  rollMode,
})

const categoryClass = computed(() =>
  activeMove.value.split('/')[2].toLowerCase().replaceAll('_', '-'),
);
</script>

<template>
  <div class="move-details mx-10 flex flex-row gap-10" :class="categoryClass">
    <div class="move-select basis-1/4">
      <MoveSelect />
    </div>
    <div class="active-move basis-1/2">
      <MoveRollOptionsCard v-if="rollMode"/>
      <MoveActiveCard v-else/>
    </div>
    <div class="assets-control basis-1/4">
      <MoveAssetControl />
    </div>
  </div>
</template>

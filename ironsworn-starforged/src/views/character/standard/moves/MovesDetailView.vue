<script setup lang="ts">
import { MoveActiveCard, MoveAssetControl, MoveSelect } from '@/components/moves';
import { inject, computed } from 'vue';

const { activeMove }:any = inject('move')

const categoryClass = computed(() => activeMove.value.split('/')[2].toLowerCase().replaceAll('_', '-'))
</script>

<template>
  <div 
    class="move-details flex flex-row gap-10 mx-10"
    :class="categoryClass"
    >
    <div class="move-select basis-1/4">
      <MoveSelect />
    </div>
    <div class="active-move basis-1/2">
      <MoveActiveCard />
    </div>
    <div class="assets-control basis-1/4">
      <MoveAssetControl />
    </div>
  </div>
</template>
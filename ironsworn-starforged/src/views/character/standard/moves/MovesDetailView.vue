<script setup lang="ts">
import { inject } from 'vue';
import { MoveActiveCard, MoveAssetControl, MoveSelect } from '@/components/moves';

// @ts-ignore
const { activeMove } = inject('move')

</script>

<template>
  <div class="move-details">
    {{ activeMove }}
    <div class="move-select">
      <MoveSelect />
    </div>
    <div class="active-move">
      <MoveActiveCard />
    </div>
    <div class="assets-control">
      <MoveAssetControl />
    </div>
  </div>
</template>
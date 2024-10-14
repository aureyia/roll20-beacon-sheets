<script setup lang="ts">
import { ref, provide } from 'vue';
import MovesOverView from '@/views/character/standard/moves/MovesOverView.vue';
import MovesDetailView from '@/views/character/standard/moves/MovesDetailView.vue';

const viewMode = ref(true);
const activeMove = ref('Face Danger')

const updateActiveMove = (moveId: string) => activeMove.value = moveId

provide('move', {
  activeMove,
  updateActiveMove
})
</script>

<template>
  <div class="moves-view">
    <!-- <div class="moves-mode-toggle ">
      <LabelledSwitch label="Detailed View" class="align-items-center m-auto" v-model="viewMode" />
    </div> -->
    <div class="moves-detail-view" v-if="viewMode">
      <MovesDetailView />
    </div>
    <div class="moves-overview" v-else>
      <MovesOverView />
    </div>
  </div>
</template>

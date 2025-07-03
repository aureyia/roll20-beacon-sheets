<script setup lang="ts">
import { ref, provide } from 'vue'
import MovesOverView from '@/views/character/StandardMovesOverView.vue'
import MovesDetailView from '@/views/character/StandardMovesDetailView.vue'

const viewMode = ref(false)
const active_move = ref('')
const selectedOption = ref('')

const update_active_move = (moveId: string) => {
    viewMode.value = true
    active_move.value = moveId
}
const clear_active_move = () => {
    viewMode.value = false
    active_move.value = ''
}

provide('move', {
    active_move,
    selectedOption,
    update_active_move,
    clear_active_move,
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

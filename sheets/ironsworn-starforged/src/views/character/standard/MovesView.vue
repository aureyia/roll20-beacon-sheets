<script setup lang="ts">
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { ref }  from 'vue';
import { Label } from '@/components/ui/label';
import { LabelledSwitch } from '@/components/switches';
import MovesOverView from '@/views/character/standard/moves/MovesOverView.vue';

const viewMode = ref(false)

</script>

<template>
  <div class="moves-view">
    <!-- <div class="moves-mode-toggle ">
      <LabelledSwitch label="Detailed View" class="align-items-center m-auto" v-model="viewMode" />
    </div> -->
    <div class="moves-detail-view" v-if="viewMode">
      <MoveDetailView />
    </div>
    <div class="moves-overview" v-else>
      <MovesOverView />
    </div>
  </div>
</template>
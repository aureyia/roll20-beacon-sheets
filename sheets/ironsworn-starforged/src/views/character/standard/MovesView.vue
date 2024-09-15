<script setup lang="ts">
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { ref }  from 'vue';
import { Label } from '@/components/ui/label';
import { LabelledSwitch } from '@/components/switches';

const viewMode = ref(false)

</script>

<template>
  <div class="moves-view mx-10">
    <div class="moves-mode-toggle">
      <LabelledSwitch label="Detailed View" v-model="viewMode" />
    </div>
    <div class="moves-detail-view" v-if="viewMode">
      2
      <MoveDetailView />
    </div>
    <div class="moves-overview" v-else>
      1
      <MoveOverview />
    </div>
  </div>
</template>
<script setup lang="ts">
import { starforged } from '@/vendor/dataforged';
// import { ItemSearch } from '@/components/search';
import { MovesGroup } from '@/components/moves';
import LabelledSwitch from '@/components/switches/LabelledSwitch.vue';
import { ref } from 'vue';

const moves = starforged['Move Categories'];

const showTriggers = ref(false);
</script>

<template>
  <div class="moves-overview">
    <!-- TODO: Implement Search -->
    <!-- <ItemSearch /> -->
    <!-- TODO: instead of roll buttons build a new menu for moves and new move group for assets -->
    <div class="moves-container mx-20 mb-20 columns-3 gap-4">
      <LabelledSwitch
        class="flex"
        label="Show Triggers"
        v-model="showTriggers"
      />
      <MovesGroup
        class="group"
        v-for="group in moves"
        :group="group"
        :showTriggers="showTriggers"
      />
    </div>
  </div>
</template>

<style lang="sass" scoped></style>

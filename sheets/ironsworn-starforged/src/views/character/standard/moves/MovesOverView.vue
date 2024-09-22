<script setup lang="ts">
import { starforged } from 'dataforged';
// import { ItemSearch } from '@/components/search';
import { MovesGroup } from '@/components/moves';

const moves = starforged['Move Categories'];
</script>

<template>
  <div class="moves-overview">
    <!-- TODO: Implement Search -->
    <!-- <ItemSearch /> -->
    <div class="moves-container mx-20 mb-20 columns-3 gap-4">
      <MovesGroup class="group" v-for="group in moves" :group="group" />
    </div>
  </div>
</template>

<style lang="sass" scoped></style>

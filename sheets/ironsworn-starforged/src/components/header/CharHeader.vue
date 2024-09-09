<script setup lang="ts">
import StandardNav from '../nav/StandardNav.vue';
import { Button } from '@/components/ui/button';

</script>

<template>
  <div class="header flex justify-between fixed top-0 left-0 right-0 py-2 text-center bg-slate-800 width-full">
    <div class="button-container basis-1/4 flex justify-start ml-4">
      <Button class="text-white bg-slate-600 drop-shadow p-2 hover:bg-slate-700 w-20">Vows</Button>
    </div>
    <StandardNav />
    <div class="button-container basis-1/4 flex justify-end mr-4">
      <Button class="text-white bg-slate-600 drop-shadow p-2 hover:bg-slate-700 w-20">Assets</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import StandardNav from '../nav/StandardNav.vue';
import { Button } from '@/components/ui/button';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';

</script>

<template>
  <div class="header flex justify-between fixed top-0 left-0 right-0 py-2 text-center bg-banner width-full">
    <div class="button-container basis-1/4 flex justify-start ml-4">
      <Button class="p-2 w-20 mr-2">Vows</Button>
      <DarkModeSwitch />
    </div>
    <StandardNav />
    <div class="button-container basis-1/4 flex justify-end mr-4">
      <Button class="p-2 w-20">Assets</Button>
    </div>
  </div>
</template>
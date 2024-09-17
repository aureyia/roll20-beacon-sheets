<script setup lang="ts">
import StandardNav from '../nav/StandardNav.vue';
import { Button } from '@/components/ui/button';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';
import { boolean } from 'zod';

defineProps({
  edgeMode: Boolean,
  default: () => false
})

</script>

<template>
  <div class="header flex flex-row justify-center fixed top-0 left-0 right-0 py-2 text-center bg-banner width-full z-10">
    <div class="button-container basis-1/4 flex justify-start ml-4" v-if="edgeMode">
      <Button class="p-2 w-20 mr-2">Vows</Button>
    </div>
    <StandardNav class="uppercase ml-2"/>
    <div class="button-container basis-1/4 flex justify-end mr-4" v-if="edgeMode">
      <Button class="p-2 w-20">Assets</Button>
    </div>
  </div>
</template>
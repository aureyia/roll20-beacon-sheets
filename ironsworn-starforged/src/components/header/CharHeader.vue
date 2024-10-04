<script setup lang="ts">
import StandardNav from '../nav/StandardNav.vue';
import { Button } from '@/components/ui/button';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';
import { boolean } from 'zod';

defineProps({
  edgeMode: Boolean,
  default: () => false,
});
</script>

<template>
  <div
    class="header width-full fixed left-0 right-0 top-0 z-10 flex flex-row justify-center bg-banner py-2 text-center"
  >
    <div class="button-container ml-4 flex basis-1/4 justify-start" v-if="edgeMode">
      <Button class="mr-2 w-20 p-2">Vows</Button>
    </div>
    <StandardNav class="ml-2 uppercase" />
    <div class="button-container mr-4 flex basis-1/4 justify-end" v-if="edgeMode">
      <Button class="w-20 p-2">Assets</Button>
    </div>
  </div>
</template>

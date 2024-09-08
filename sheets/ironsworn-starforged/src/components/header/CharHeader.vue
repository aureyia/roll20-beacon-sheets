<script setup lang="ts">
import StandardNav from '../nav/StandardNav.vue';
import { Button } from '@/components/ui/button';

</script>

<template>
  <div class="header flex justify-between fixed top-0 left-0 right-0 py-1 text-center bg-slate-700 width-full">
    <div>
      <Button>Vows</Button>
    </div>
    <StandardNav />
    <div>
      <Button>Assets</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CardContent } from '@/components/ui/card';
import { marked } from 'marked';

defineProps({
  moveData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <CardContent>
    <div class="move-content text-sm" v-html="marked.parse(moveData.Text)" />
  </CardContent>
</template>

<style scoped lang="scss"></style>

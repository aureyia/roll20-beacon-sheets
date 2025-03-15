<script setup lang="ts">
import { CardContent } from '@/components/ui/card';
import { marked } from 'marked';

const props = defineProps({
  move: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <CardContent>
    <p v-html="marked.parse(move.Text)" />
  </CardContent>
</template>

<style scoped lang="scss"></style>

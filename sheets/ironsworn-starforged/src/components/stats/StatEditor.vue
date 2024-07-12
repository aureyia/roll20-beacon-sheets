<template>
  <div>
    {{ stat }}
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    stat?: string
  }>()
</script>
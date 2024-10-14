<script setup lang="ts">
import { inject } from 'vue';

// @ts-ignore
const { activeMove, updateActiveMove } = inject('move')
</script>

<template>
  <div>
    <Button @click="updateActiveMove('Face Danger')">Update</Button>
  </div>
</template>
<script setup lang="ts">
import { Input } from '@/components/ui/input'

defineProps({
  label: {
    type: String,
    required: true
  }
})
const model = defineModel({
  type: String ?? Number,
  required: true
})

</script>

<template>
  <div class="labelled-input">
    <h3>{{ label }}</h3>
    <Input v-model="model" />
  </div>
</template>
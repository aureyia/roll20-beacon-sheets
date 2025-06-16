<script setup lang="ts">
import { Input } from '@/components/ui/input'

defineProps({
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'text',
    },
})

const model = defineModel<string | number>({ required: true })
</script>

<template>
  <div class="labelled-input">
    <span class="mr-2 text-lg">{{ label }}</span>
    <Input class="bg-input" :type="type" v-model="model" />
  </div>
</template>

<style lang="sass" scoped>
.labelled-input
  align-items: center
</style>

<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number
  }
})

const model = defineModel<number>({ required: true })

</script>

<template>
  <div class="labelled-input">
    <div>{{ label }}</div>
    <NumberField v-model="model" class="ml-2 w-28">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput class="bg-slate-900"/>
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>

<style lang="sass" scoped>
.labelled-input
  align-items: center
</style>
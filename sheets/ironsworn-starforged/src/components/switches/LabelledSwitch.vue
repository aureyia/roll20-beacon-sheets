<script setup lang="ts">
import { Switch } from '@/components/ui/switch'

defineProps({
  label: {
    type: String,
    required: true
  }
})

const model = defineModel<boolean>({ required: true })

</script>

<template>
  <div class="labelled-switch">
    <span class="mr-2 text-lg">{{ label }}</span>
    <Switch class="data-[state=checked]:bg-slate-500 data-[state=unchecked]:bg-slate-800" v-model:checked="model" />
  </div>
</template>

<style lang="sass" scoped>
.labelled-switch
  align-items: center
</style>
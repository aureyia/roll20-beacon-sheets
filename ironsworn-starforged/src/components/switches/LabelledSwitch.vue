<script setup lang="ts">
import { Switch } from '@/components/ui/switch'

defineProps({
  label: {
    type: String,
    required: true,
  },
})

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="labelled-switch">
    <span class="mr-2 text-lg">{{ label }}</span>
    <Switch
      class="data-[state=checked]:bg-switch-on data-[state=unchecked]:bg-switch-off"
      v-model:model-value="model"
    />
  </div>
</template>

<style lang="sass" scoped>
.labelled-switch
  align-items: center
</style>

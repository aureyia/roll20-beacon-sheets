<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectSeparator, type SelectSeparatorProps } from 'reka-ui'
import { cn } from '@/utility'

const props = defineProps<
    SelectSeparatorProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <SelectSeparator
    v-bind="delegatedProps"
    :class="cn('bg-muted -mx-1 my-1 h-px', props.class)"
  />
</template>

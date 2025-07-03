<script setup lang="ts">
import { store_impacts, type ImpactsGrouped } from '@/system/impacts_store'
import {
    DialogTrigger,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '../ui/dialog'
import { Button } from '../ui/button'
import type { AnyImpact } from '@/system/impacts_types'

const impacts = store_impacts
const getImpactsByCategory = (category: keyof ImpactsGrouped) =>
    store_impacts.get().context[category]

defineProps({
    label: {
        type: String,
        required: true,
    },
})

const removeImpact = (impact: AnyImpact) => {
    impacts.trigger.remove(impact)
}
</script>

<template>
  <div class="impact-list">
    <div
      v-for="impact in getImpactsByCategory(label as keyof ImpactsGrouped)"
      :key="impact._id"
      class="relative z-0 mt-3 h-8 content-center"
    >
      <div class="impact-name p-1">{{ impact.name }}</div>
      <Dialog>
        <DialogTrigger>
          <Button
            v-if="$attrs.modelValue"
            class="items center absolute inset-0 z-10 flex h-8 w-full justify-center bg-[#7f1d1d9e] hover:bg-[#c112129e]"
          />
        </DialogTrigger>
        <DialogContent class="w-60">
          <DialogTitle>Remove Impact?</DialogTitle>
          <DialogFooter>
            <DialogClose class="flex w-full justify-between gap-2">
              <Button>Cancel</Button>
              <Button variant="destructive" @click="removeImpact(impact)"
                >Delete</Button
              >
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.impact-name
  align-content: center
</style>

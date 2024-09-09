<script setup lang="ts">
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';
import { DialogTrigger, Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import type { AnyImpact } from '@/system/impacts';

const impacts = useImpactsStore();
const getImpactsByCategory = (category: string) => impacts.list.filter((impact) => impact.category === category)

defineProps({
  label: {
    type: String,
    required: true
  }
})

const removeImpact = (impact: AnyImpact) => {
  console.log(impact)
  impacts.removeImpact(impact)
}
</script>

<template>
  <div class="impact-list">
    <div v-for="impact in getImpactsByCategory(label)" :key="impact._id" class="relative z-0 h-8 content-center mt-3">
      <div class="impact-name p-1">{{ impact.name }}</div>
      <Dialog>
        <DialogTrigger>
          <Button v-if="$attrs.modelValue" class="bg-[#7f1d1d9e] hover:bg-[#c112129e] absolute inset-0 flex justify-center items center z-10 h-8 w-full" />
        </DialogTrigger>
        <DialogContent class="w-60">
          <DialogTitle>Remove Impact?</DialogTitle>
          <DialogFooter>
            <DialogClose class="flex justify-between gap-2 w-full">
              <Button>Cancel</Button>
              <Button variant="destructive" @click="removeImpact(impact)">Delete</Button>
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
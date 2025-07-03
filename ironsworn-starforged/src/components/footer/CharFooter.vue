<script setup lang="ts">
import { computed, ref } from 'vue'
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { store_impacts } from '@/system/impacts_store'
import { store_momentum } from '@/system/momentum_store'
import { momentum_max, momentum_reset } from '@/system/momentum_utils'

const impacts = store_impacts.get()
const momentum = store_momentum.get().context.momentum
const ref_momentum = ref(momentum)

const list_impacts = [
    ...impacts.context.misfortunes,
    ...impacts.context.lasting_effects,
    ...impacts.context.burdens,
    ...impacts.context.current_vehicle,
    ...impacts.context.other,
]

const number_of_impacts = computed(() => list_impacts.length)

const momentum_burn = (reset: number) => {
    store_momentum.trigger.set({ value: reset })
}

store_momentum.subscribe(snapshot => {
    ref_momentum.value = snapshot.context.momentum
})

defineProps({
    mode_edge: Boolean,
    default: () => false,
})
</script>

<template>
  <div
    class="footer width-full bg-banner fixed right-0 bottom-0 left-0 flex justify-center py-2 text-center"
  >
    <DarkModeSwitch />
    <div
      class="button-container ml-4 flex basis-1/4 justify-start"
      v-if="mode_edge"
    >
      <Button class="w-20 p-2 drop-shadow-sm">Progress</Button>
    </div>
    <div class="flex items-center">
      <ToggleGroup
        type="single"
        class="mr-2"
        :modelValue="ref_momentum.toString()"
        @update:modelValue="
          store_momentum.trigger.set({ value: Number($event.toString()) })
        "
      >
        <ToggleGroupItem
          v-for="option in Array.from(
            { length: momentum_max(number_of_impacts) + 7 },
            (_, i) => i - 6,
          )"
          :key="option"
          :value="option.toString()"
          class="text-foreground hover:bg-muted-accent data-[state=on]:bg-muted-accent data-[state=off]:text-foreground data-[state=on]:text-foreground"
          :class="{
            'momentum-reset': option === momentum_reset(number_of_impacts),
          }"
          >{{ option }}</ToggleGroupItem
        >
      </ToggleGroup>
      <Button
        class="border-primary bg-muted text-primary hover:bg-muted-accent h-8 w-24 border-2 font-bold"
        @click="momentum_burn(momentum_reset(number_of_impacts))"
        >Burn</Button
      >
    </div>
    <div
      class="button-container mr-4 flex basis-1/4 justify-end"
      v-if="mode_edge"
    >
      <Button class="w-20 p-2 drop-shadow-sm">Chronicle</Button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.momentum-reset
  border: 2px dashed hsl(var(--primary))
</style>

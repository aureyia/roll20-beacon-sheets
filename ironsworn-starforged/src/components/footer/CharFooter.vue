<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { impactsStore } from '@/system/impacts/store'
import { momentumMax, momentumReset } from '@/system/momentum/utils'
import { computed, ref } from 'vue'
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue'
import { momentumStore } from '@/system/momentum/store'

const impacts = impactsStore.get()
const momentum = momentumStore.get().context.momentum
const momentumRef = ref(momentum)

const impactsList = [
    ...impacts.context.misfortunes,
    ...impacts.context.lastingEffects,
    ...impacts.context.burdens,
    ...impacts.context.currentVehicle,
    ...impacts.context.other,
]

const numberOfImpacts = computed(() => impactsList.length)

const burnMomentum = (resetValue: number) => {
    momentumStore.trigger.set({ value: resetValue })
}

momentumStore.subscribe(snapshot => {
    momentumRef.value = snapshot.context.momentum
})

defineProps({
    edgeMode: Boolean,
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
      v-if="edgeMode"
    >
      <Button class="w-20 p-2 drop-shadow-sm">Progress</Button>
    </div>
    <div class="flex items-center">
      <ToggleGroup
        type="single"
        class="mr-2"
        :modelValue="momentumRef.toString()"
        @update:modelValue="
          momentumStore.trigger.set({ value: parseInt($event.toString()) })
        "
      >
        <ToggleGroupItem
          v-for="option in Array.from(
            { length: momentumMax(numberOfImpacts) + 7 },
            (_, i) => i - 6,
          )"
          :key="option"
          :value="option.toString()"
          class="text-foreground hover:bg-muted-accent data-[state=on]:bg-muted-accent data-[state=off]:text-foreground data-[state=on]:text-foreground"
          :class="{
            'momentum-reset': option === momentumReset(numberOfImpacts),
          }"
          >{{ option }}</ToggleGroupItem
        >
      </ToggleGroup>
      <Button
        class="border-primary bg-muted text-primary hover:bg-muted-accent h-8 w-24 border-2 font-bold"
        @click="burnMomentum(momentumReset(numberOfImpacts))"
        >Burn</Button
      >
    </div>
    <div
      class="button-container mr-4 flex basis-1/4 justify-end"
      v-if="edgeMode"
    >
      <Button class="w-20 p-2 drop-shadow-sm">Chronicle</Button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.momentum-reset
  border: 2px dashed hsl(var(--primary))
</style>

<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';

const resourcesStore = useResourcesStore()

defineProps({
  edgeMode: Boolean,
  default: () => false
})
</script>

<template>
  <div class="footer flex fixed justify-center bottom-0 left-0 right-0 py-2 text-center bg-banner width-full">
    <DarkModeSwitch/>
    <div class="button-container basis-1/4 flex justify-start ml-4" v-if="edgeMode">
      <Button class="drop-shadow p-2 w-20">Progress</Button>
    </div>
    <div class="flex items-center">
      <ToggleGroup 
        type="single"
        class="mr-2"
        :modelValue="resourcesStore.momentum.toString()"
        @update:modelValue="resourcesStore.momentum = parseInt($event.toString())"
      >
        <ToggleGroupItem 
          v-for="(option) in Array.from({ length: (resourcesStore.momentumMax + 7) }, (_, i) => i - 6)"
          :key="option"
          :value="option.toString()"
          class="text-foreground hover:bg-muted-accent data-[state=on]:bg-muted-accent data-[state=on]:text-foreground data-[state=off]:text-foreground"
          :class="{ 'momentum-reset': option === resourcesStore.momentumReset }"
        >{{ option }}</ToggleGroupItem>
      </ToggleGroup>
      <Button class="h-8 text-primary hover:bg-muted-accent border-primary bg-muted border-2 font-bold w-24" @click="resourcesStore.momentum = resourcesStore.momentumReset">Burn</Button>
    </div>
    <div class="button-container basis-1/4 flex justify-end mr-4" v-if="edgeMode">
      <Button class="drop-shadow p-2 w-20">Chronicle</Button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.momentum-reset
  border: 2px dashed hsl(var(--primary))
</style>
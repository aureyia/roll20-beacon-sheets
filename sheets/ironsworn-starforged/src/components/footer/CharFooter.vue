<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';

const resourcesStore = useResourcesStore()

</script>

<template>
  <div class="footer flex fixed bottom-0 left-0 right-0 py-2 text-center bg-slate-800 width-full">
    <div class="button-container basis-1/4 flex justify-start ml-4">
      <Button class="text-white bg-slate-600 drop-shadow p-2 hover:bg-slate-700 w-20">Progress</Button>
    </div>
    <div class="flex basis-2/4">
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
          class="hover:bg-slate-700 data-[state=on]:bg-slate-700 data-[state=on]:text-white"
          :class="{ 'momentum-reset': option === resourcesStore.momentumReset }"
        >{{ option }}</ToggleGroupItem>
      </ToggleGroup>
      <Button class="text-white bg-slate-600 drop-shadow p-2 hover:bg-slate-700" @click="resourcesStore.momentum = resourcesStore.momentumReset">Burn</Button>
    </div>
    <div class="button-container basis-1/4 flex justify-end mr-4">
      <Button class="text-white bg-slate-600 drop-shadow p-2 hover:bg-slate-700 w-20">Chronicle</Button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.momentum-reset
  border: 2px dashed white
</style>
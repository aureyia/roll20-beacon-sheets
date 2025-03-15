<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';

const resourcesStore = useResourcesStore();

defineProps({
  edgeMode: Boolean,
  default: () => false,
});
</script>

<template>
  <div
    class="footer width-full fixed bottom-0 left-0 right-0 flex justify-center bg-banner py-2 text-center"
  >
    <DarkModeSwitch />
    <div
      class="button-container ml-4 flex basis-1/4 justify-start"
      v-if="edgeMode"
    >
      <Button class="w-20 p-2 drop-shadow">Progress</Button>
    </div>
    <div class="flex items-center">
      <ToggleGroup
        type="single"
        class="mr-2"
        :modelValue="resourcesStore.momentum.toString()"
        @update:modelValue="
          resourcesStore.momentum = parseInt($event.toString())
        "
      >
        <ToggleGroupItem
          v-for="option in Array.from(
            { length: resourcesStore.momentumMax + 7 },
            (_, i) => i - 6,
          )"
          :key="option"
          :value="option.toString()"
          class="text-foreground hover:bg-muted-accent data-[state=on]:bg-muted-accent data-[state=off]:text-foreground data-[state=on]:text-foreground"
          :class="{ 'momentum-reset': option === resourcesStore.momentumReset }"
          >{{ option }}</ToggleGroupItem
        >
      </ToggleGroup>
      <Button
        class="h-8 w-24 border-2 border-primary bg-muted font-bold text-primary hover:bg-muted-accent"
        @click="resourcesStore.momentum = resourcesStore.momentumReset"
        >Burn</Button
      >
    </div>
    <div
      class="button-container mr-4 flex basis-1/4 justify-end"
      v-if="edgeMode"
    >
      <Button class="w-20 p-2 drop-shadow">Chronicle</Button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.momentum-reset
  border: 2px dashed hsl(var(--primary))
</style>

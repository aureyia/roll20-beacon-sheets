<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useMomentumStore } from '@/internal/momentum/infrastructure/store';
import { useImpactsStore } from '@/internal/impacts/infrastructure/store';
import {
  momentumMax,
  momentumReset,
} from '@/internal/momentum/application/helpers';
import { computed } from 'vue';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';

const impacts = useImpactsStore();
const momentumStore = useMomentumStore();

const numberOfImpacts = computed(() => impacts.list.length);

const burnMomentum = (resetValue: number) => {
  momentumStore.momentum = resetValue;
};

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
        :modelValue="momentumStore.momentum.toString()"
        @update:modelValue="
          momentumStore.momentum = parseInt($event.toString())
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
        class="h-8 w-24 border-2 border-primary bg-muted font-bold text-primary hover:bg-muted-accent"
        @click="burnMomentum(momentumReset(numberOfImpacts))"
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

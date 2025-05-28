<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useMomentumStore } from '@/system/momentum/store';
import { useImpactsStore } from '@/system/impacts/store';
import { momentumMax, momentumReset } from '@/system/momentum/helpers';
import { computed, ref, inject } from 'vue';
import DarkModeSwitch from '@/components/switches/DarkModeSwitch.vue';
import { momentumStore } from '@/system/momentum/store.x';

const impacts = useImpactsStore();
// const momentumStore = useMomentumStore();
const momentum = momentumStore.select((state) => state.momentum);
const momentumRef = ref(momentum.get());
const sync = inject('sync')

momentum.subscribe((momentum) => {
  momentumRef.value = momentum;
});

const numberOfImpacts = computed(() => impacts.list.length);

const burnMomentum = (resetValue: number) => {
  momentumStore.trigger.set({ value: resetValue });
};

momentumStore.subscribe((snapshot) => {
  console.log('snapshot', snapshot);
  sync.send({
    type: 'update',
    // store: 'momentum',
    // entries: [
    //   {
    //     name: 'momentum',
    //     value: snapshot.context.momentum,
    //   },
    // ],
  });
});

const nom = () => {
  sync.send({
    type: 'initialised'
  })
}

const nom2 = () => {
  sync.send({
    type: 'synced'
  })
}

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
        class="h-8 w-24 border-2 border-primary bg-muted font-bold text-primary hover:bg-muted-accent"
        @click="burnMomentum(momentumReset(numberOfImpacts))"
        >Burn</Button
      >
      <Button
        class="h-8 w-16 border-2 border-primary bg-muted font-bold text-primary hover:bg-muted-accent"
        @click="nom()"
        >Init</Button
      >
      <Button
        class="h-8 w-16 border-2 border-primary bg-muted font-bold text-primary hover:bg-muted-accent"
        @click="nom2()"
        >Synced</Button
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

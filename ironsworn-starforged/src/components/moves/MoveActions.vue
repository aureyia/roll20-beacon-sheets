<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { IMoveTriggerOptionAction } from 'dataforged';
import { followUpRoll, rollMove } from '@/utility/moves/rollMove';
import { moveRollV2 } from '@/utility/moves/rollMoveV2';
import { inject, ref } from 'vue';
import { Effect } from 'effect';
import { useMomentumStore } from '@/system/momentum/store';
import { useStatsStore } from '@/system/stats/store';

const props = defineProps({
  move: {
    type: Object,
    required: true,
  },
});

const { rollMode }: boolean = inject('roll');
const { selectedOption }: string = inject('move');
const modifier = ref<number>(0);

const startMoveRoll = async (options: IMoveTriggerOptionAction[]) => {
  if (options.length > 1 && selectedOption.value === '') {
    rollMode.value = true;
    return;
  }

  const { momentum } = useMomentumStore();
  const stats = useStatsStore();

  const formattedModifier = Number(modifier.value);
  const roll = await rollMove(2, formattedModifier, options[0], momentum);
  const roll2 = await Effect.runPromise(await moveRollV2(2, formattedModifier));
  console.log('roll2', roll2);
  await followUpRoll(roll);
};
</script>

<template>
  <div class="flex w-full items-end justify-between p-3">
    <NumberField
      v-if="props.move.Trigger.Options && selectedOption"
      id="modifiers"
      :default-value="0"
      :min="0"
      @update:modelValue="(value) => (modifier = value)"
      class="items-center"
    >
      <Label for="modifiers">Modifier</Label>
      <NumberFieldContent class="w-28">
        <NumberFieldDecrement class="bg-muted" />
        <NumberFieldInput class="bg-muted" />
        <NumberFieldIncrement class="bg-muted" />
      </NumberFieldContent>
    </NumberField>
    <Button v-if="props.move.Oracles">Roll Oracle</Button>
    <Button
      v-if="props.move.Trigger.Options"
      @click="startMoveRoll(props.move.Trigger.Options)"
      >Roll</Button
    >
  </div>
</template>

<style scoped lang="scss"></style>

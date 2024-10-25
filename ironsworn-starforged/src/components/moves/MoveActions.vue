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
import { rollMove } from '@/utility/moves/rollMove';
import { inject, ref } from 'vue';

const props = defineProps({
  move: {
    type: Object,
    required: true,
  },
});

const { rollMode }: boolean = inject('roll');
const { selectedOption }: string = inject('move')
const modifier = ref<number>(0);

const startMoveRoll = async (options: IMoveTriggerOptionAction[]) => {
  console.log('selectedOption', selectedOption.value);
  if (options.length > 1 && selectedOption.value === '') {
    rollMode.value = true;
    return
  }
  const formattedModifier = Number(modifier.value)
  const rollOutput = await rollMove(2, formattedModifier, options[0]);
  console.log(rollOutput);
  return rollOutput;
};
</script>

<template>
  <NumberField
    v-if="props.move.Trigger.Options"
    id="modifiers"
    :default-value="0"
    :min="0"
    @update:modelValue="(value) => modifier = value"
    class="flex items-center"
  >
    <Label for="modifiers">Mod</Label>
    <NumberFieldContent class="w-28">
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
  <Button v-if="props.move.Oracles">Roll Oracle</Button>
  <Button v-if="props.move.Trigger.Options" @click="startMoveRoll(props.move.Trigger.Options)"
    >Roll</Button
  >
</template>

<style scoped lang="scss"></style>

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
import type { IMoveTriggerOptionAction } from '@/vendor/dataforged';
import { inject, ref } from 'vue';
import { Effect, Layer } from 'effect';
import { momentumStore } from '@/system/momentum/store';
import { statsStore } from '@/system/stats/store';
import { roll as actionRoll } from '@/system/rolls/handlers/action-roll';
import { roll as progressRoll } from '@/system/rolls/handlers/progress-roll';
import { roll as oracleRoll } from '@/system/rolls/handlers/oracle-roll';
import { RollFormatterLive } from '@/system/rolls/formatter';
import { DispatchLive } from '@/system/rolls/dispatch';
import { ActionRollLive } from '@/system/rolls/handlers/action-roll';
import { ActionScoreLive } from '@/system/rolls/action-score';

const FormatAndRollLive = RollFormatterLive.pipe(Layer.provide(DispatchLive));
const MainLive = ActionRollLive.pipe(
  Layer.provide(FormatAndRollLive),
  Layer.provide(ActionScoreLive),
);

const momentum = ref(momentumStore.get().context.momentum);

const props = defineProps({
  move: {
    type: Object,
    required: true,
  },
});

const { moveMode, actor } = inject('roll');
const { selectedOption } = inject('move');
const modifier = ref<number>(0);

const burnMomentum = (choice: boolean) => {
  actor.send({
    type: 'burnChoice',
    value: choice,
  });
  moveMode.value = 'content';
};

const startMoveRoll = async (options: IMoveTriggerOptionAction[]) => {
  if (options.length > 1 && selectedOption.value === '') {
    moveMode.value = 'options';
    return;
  }

  const momentum = momentumStore.get().context.momentum;
  const stats = statsStore.get().context;
  const formattedModifier = Number(modifier.value);
  // TODO: Update this to use the parsed version
  // const baseBonus = stats[selectedOption.value.Using[0].toLowerCase()]
  const baseBonus = 2;

  await Effect.runPromise(
    actionRoll(
      actor,
      formattedModifier + baseBonus,
      momentum,
      props.move.Name,
    ).pipe(Effect.provide(MainLive)),
  );

  selectedOption.value = '';
  // moveMode.value = 'content';
};
</script>

<template>
  <div class="w-full p-3">
    <div
      class="flex items-end justify-between"
      v-if="moveMode === 'momentumBurn'"
    >
      <Button variant="default" @click="burnMomentum(true)">Yes</Button>
      <Button variant="destructive" @click="burnMomentum(false)">No</Button>
    </div>
    <div class="flex items-end justify-between" d v-else>
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
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { Effect, Layer } from 'effect'
import { inject, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { store_momentum } from '@/system/momentum_store'
import { ActionScoreLive } from '@/system/rolls/action_score'
import { DispatchLive } from '@/system/rolls/dispatch'
import { RollFormatterLive } from '@/system/rolls/formatter'
import { ActionRollLive, roll as actionRoll } from '@/system/rolls/handler_action_roll'
import { roll as oracleRoll } from '@/system/rolls/handler_oracle_roll'
import { roll as progressRoll } from '@/system/rolls/handler_progress_roll'
import { store_stats } from '@/system/stats.store'
import type { IMoveTriggerOptionAction } from '@/vendor/dataforged'

const props = defineProps({
    move: {
        type: Object,
        required: true,
    },
})

const { moveMode, actor } = inject('roll')
const { selectedOption } = inject('move')
const modifier = ref<number>(0)

const momentum_burn = (choice: boolean) => {
    actor.send({
        type: 'burnChoice',
        value: choice,
    })
    moveMode.value = 'content'
}

const startMoveRoll = async (options: IMoveTriggerOptionAction[]) => {
    if (options.length > 1 && selectedOption.value === '') {
        moveMode.value = 'options'
        return
    }

    const momentum = store_momentum.get().context.momentum
    const stats = store_stats.get().context
    const formattedModifier = Number(modifier.value)
    // TODO: Update this to use the parsed version
    // const baseBonus = stats[selectedOption.value.Using[0].toLowerCase()]
    const baseBonus = 2

    const MainLive = ActionRollLive.pipe(
        Layer.provide(RollFormatterLive),
        Layer.provide(ActionScoreLive),
        Layer.provide(DispatchLive)
    )

    await Effect.runPromise(
        actionRoll(
            actor,
            formattedModifier + baseBonus,
            momentum,
            props.move.Name
        ).pipe(Effect.provide(MainLive))
    )

    selectedOption.value = ''
    // moveMode.value = 'content';
}
</script>

<template>
  <div class="w-full p-3">
    <div
      class="flex items-end justify-between"
      v-if="moveMode === 'momentumBurn'"
    >
      <Button variant="default" @click="momentum_burn(true)">Yes</Button>
      <Button variant="destructive" @click="momentum_burn(false)">No</Button>
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

<script setup lang="ts">
import { Effect, Layer, ManagedRuntime, pipe, Ref, Runtime } from 'effect';
import { CardHeader, Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { inject, computed, provide, ref, onMounted, onUnmounted } from 'vue';
import { marked } from 'marked';
import { getMoveData } from '@/utility/moves/getMoveData';
import { MoveActions } from '@/components/moves';
import { roll as actionRoll } from '@/system/rolls/action-roll-handler';
import { roll as progressRoll } from '@/system/rolls/progress-roll-handler';
import { roll as oracleRoll } from '@/system/rolls/oracle-roll-handler';
import {
  machine,
  type outcomeActor,
} from '@/system/rolls/machines/calculate-outcome';
import { createActor } from 'xstate';

const { activeMove }: any = inject('move');
const actor = createActor(machine);

const showDialog = ref(false);

onMounted(() => {
  console.log('mounted');
  actor.subscribe((snapshot) => {
    // Check if it's in the state where you want to show the element
    const matched =
      snapshot.matches('Eligible for Opportunity') ||
      snapshot.matches('Hitting: Eligible for Strong Hit') ||
      snapshot.matches('Missing: Eligible for Strong Hit') ||
      snapshot.matches('Eligible for Weak Hit');

    console.log(snapshot);
    showDialog.value = matched;
  });
});

const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));

const testRoll = async () => {
  await Effect.runPromise(actionRoll(actor, 2));
};

const burnMomentum = (choice: boolean) => {
  console.log('burnChoice', choice);
  actor.send({
    type: 'burnChoice',
    value: choice,
  });
};

onUnmounted(() => {
  actor.stop();
  actor.send({
    type: 'test',
    value: 'test',
  });
  console.log('unmounted');
});
</script>

<template>
  <Card class="mb-20 rounded-lg">
    <CardHeader class="pb-2 text-lg font-bold">{{ moveData.Name }}</CardHeader>
    <CardContent>
      <!-- TODO: Build translation parser for i18n -->
      <div
        v-if="!showDialog"
        class="move-content text-sm"
        v-html="marked.parse(moveData.Text)"
      />
      <div v-else>
        <p>Do you want to burn momentum?</p>
        <p>Current:</p>
        <p>Burned Result:</p>
      </div>
    </CardContent>
    <CardFooter class="rounded-b-lg bg-muted-secondary p-0 empty:hidden">
      <MoveActions v-if="!showDialog" :move="moveData" />
      <div class="m-3 flex gap-3">
        <Button v-if="!showDialog" prevent.click @mousedown="testRoll"
          >TestRoll</Button
        >
        <Button
          variant="default"
          v-if="showDialog"
          prevent.click
          @mousedown="burnMomentum(true)"
          >Burn</Button
        >
        <Button
          variant="destructive"
          v-if="showDialog"
          prevent.click
          @mousedown="burnMomentum(false)"
          >Don't burn</Button
        >
      </div>
    </CardFooter>
  </Card>
</template>

<style lang="sass">
// TODO: Fix scroll padding for long card
.move-content
  table
    margin-top: 1em
    border: 1px solid
    font-size: small
    thead
      tr
        border-bottom: solid 1px
        th:first-child
          border-right: solid 1px
          width: 3.5em
          padding: 0em 0.2em
    tbody
      tr:nth-child(even)
        background-color: hsl(var(--muted-secondary))
      tr
        td:first-child
          text-align: center
          border-right: solid 1px
          width: 3.8em
          padding: 0em 0.2em
        td:last-child
          padding-left: 0.3em

  p
    margin-top: 0.5em

  ul
    margin-top: 0.2em
    padding-left: 1.1em
    list-style: disc
</style>

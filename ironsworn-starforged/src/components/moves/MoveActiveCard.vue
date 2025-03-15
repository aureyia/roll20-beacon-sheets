<script setup lang="ts">
import { Effect, Layer } from 'effect';
import { CardHeader, Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { inject, computed, provide } from 'vue';
import { marked } from 'marked';
import { getMoveData } from '@/utility/moves/getMoveData';
import { MoveActions } from '@/components/moves';
import { roll } from '@/internal/rolls/bootstrap/roll-handler';

const { activeMove }: any = inject('move');

const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));
const testRoll = async () => {
  console.log(await roll(2));
};
</script>

<template>
  <Card class="mb-20 rounded-lg">
    <CardHeader class="pb-2 text-lg font-bold">{{ moveData.Name }}</CardHeader>
    <CardContent>
      <!-- TODO: Build translation parser for i18n -->
      <div class="move-content text-sm" v-html="marked.parse(moveData.Text)" />
    </CardContent>
    <CardFooter class="rounded-b-lg bg-muted-secondary p-0 empty:hidden">
      <MoveActions :move="moveData" />
      <Button @click="testRoll">TestRoll</Button>
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

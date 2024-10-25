<script setup lang="ts">
import { Effect } from 'effect';
import { CardHeader, Card, CardContent, CardFooter } from '../ui/card';
import {inject, computed, provide} from 'vue';
import { marked } from 'marked';
import { getMoveData } from '@/utility/moves/getMoveData'
import { MoveActions } from "@/components/moves";

const { activeMove }: any = inject('move');

const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));
</script>

<template>
  <Card class="rounded-lg mb-20">
    <CardHeader class="pb-2 text-lg font-bold">{{ moveData.Name }}</CardHeader>
    <CardContent>
      <!-- TODO: Build translation parser for i18n -->
      <div class="text-sm move-content" v-html="marked.parse(moveData.Text)"/>
    </CardContent>
    <CardFooter class="bg-muted-secondary rounded-b-lg justify-between flex p-3 empty:hidden">
      <MoveActions :move="moveData" />
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
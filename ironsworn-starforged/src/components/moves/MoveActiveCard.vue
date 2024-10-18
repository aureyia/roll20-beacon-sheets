<script setup lang="ts">
import { Effect } from 'effect';
import { CardHeader, Card, CardContent, CardFooter } from '../ui/card';
import { inject, computed } from 'vue';
import { starforged } from 'dataforged';
import { marked } from 'marked';

const { activeMove }: any = inject('move');

const getMoveData = (moveId: string) => {
  console.log('nom', moveId);
  const categoryId = moveId.split('/').slice(0, 3).join('/');
  const dfMoveCategory = starforged['Move Categories'].find(
    (category) => category.$id === categoryId,
  );

  if (!dfMoveCategory) {
    return Effect.fail(new Error(`No Move Category was found for: ${moveId}`));
  }

  const dfMove = dfMoveCategory.Moves.find((move) => move.$id === moveId);

  if (!dfMove) {
    return Effect.fail(new Error(`No Move found for Category: ${moveId}`));
  }

  return Effect.succeed(dfMove);
};

const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));
</script>

<template>
  <Card>
    <CardHeader>{{ moveData.Name }}</CardHeader>
    <CardContent>
      <div class="text-sm" v-html="marked.parse(moveData.Text)"></div>
    </CardContent>
    <CardFooter> </CardFooter>
  </Card>
</template>

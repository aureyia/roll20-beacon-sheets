<script setup lang="ts">
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import { inject, computed, ref } from "vue";
import { getMoveData } from "@/utility/moves/getMoveData";
import { RadioGroup} from "@/components/ui/radio-group";
import {Effect} from "effect";
import {Label} from "@/components/ui/label";
import MoveActions from "@/components/moves/MoveActions.vue";

const { activeMove, selectedOption }: any = inject('move');
const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));
</script>

<template>
  <Card>
    <CardHeader>{{ moveData.Name}}</CardHeader>
    <CardContent>
      <RadioGroup v-model="selectedOption" default-value="">
        <div v-for="option in moveData.Trigger.Options" :key="option.$id">
          <RadioGroupItem :id="option.$id" :value="option.$id"/>
          <Label :for="option.$id">{{option.Text}}</Label>
        </div>
      </RadioGroup>
    </CardContent>
    <CardFooter>
      <MoveActions :move="moveData" />
    </CardFooter>
  </Card>
</template>

<style scoped lang="scss">

</style>
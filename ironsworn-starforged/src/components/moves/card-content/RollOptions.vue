<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { inject, computed, ref } from 'vue';
import { getMoveData } from '@/utility/moves/getMoveData';
import { RadioGroup } from '@/components/ui/radio-group';
import { Effect } from 'effect';
import { Label } from '@/components/ui/label';

const { activeMove, selectedOption }: any = inject('move');
const moveData = computed(() => Effect.runSync(getMoveData(activeMove.value)));
</script>

<template>
  <CardContent>
    <p class="text-sm">{{ moveData.Trigger.Text }}</p>
    <p class="mt-2 text-sm">Options:</p>
    <RadioGroup class="mt-2" v-model="selectedOption" default-value="">
      <div v-for="option in moveData.Trigger.Options" :key="option.$id">
        <RadioGroupItem :id="option.$id" :value="option" />
        <Label class="ml-2 cursor-pointer" :for="option.$id">{{
          option.Text
        }}</Label>
      </div>
    </RadioGroup>
  </CardContent>
</template>

<style scoped lang="scss"></style>

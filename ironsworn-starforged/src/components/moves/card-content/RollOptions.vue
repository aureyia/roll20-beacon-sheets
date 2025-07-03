<script setup lang="ts">
import { Effect } from 'effect'
import { inject, computed, ref } from 'vue'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { get_move_data } from '@/system/moves_utils'

const { active_move, selectedOption }: any = inject('move')
const moveData = computed(() => Effect.runSync(get_move_data(active_move.value)))
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

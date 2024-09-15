<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ref, watch } from 'vue';
import { useTaskStore } from '@/sheet/stores/chronicle/tasksStore';

const INPUTS = ['0', '1', '2', '3', '4'] as const
const props = defineProps({ id: String, ticks: String })
const selectedValue = ref(props.ticks)
const taskStore = useTaskStore()

const differenceOf = (a: string) => (b: string) => parseInt(b) - parseInt(a)
const progressUpdate = (id: string, value: string) => {
  parseInt(props.ticks as string) !== parseInt(value) 
    ? taskStore.manualProgressUpdate(id, differenceOf(props.ticks as string)(value)) 
    : null

  selectedValue.value !== props.ticks ? selectedValue.value = props.ticks : selectedValue.value
}

watch(() => props.ticks, (newValue) => {
  selectedValue.value = newValue
})

</script>

<template>
  <div class="progress-input-holder w-14 h-14 relative">
    <Select v-model="selectedValue" @update:model-value="progressUpdate(props.id as string, $event)" class="w-14 h-14 absolute top-0 left-0">
      <SelectTrigger class="w-14 h-14 ">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent class="min-w-20">
        <SelectGroup >
          <SelectItem v-for="value in INPUTS" :value="value">{{value}}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <span 
      class="bg-muted border-2 rounded border-primary absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
      :value="selectedValue"
    ></span> 
  </div>
</template>

<style lang="sass">
.progress-input
  -webkit-appearance: none

.progress-input-holder .Select
  z-index: 1

.progress-input-holder .Select span
  z-index: 2

.progress-input-holder input, 
input + span
  background: hsl(var(--primary-foreground))

.progress-input-holder span[value="0"]
  display: block

.progress-input-holder span[value="1"]
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px))

.progress-input-holder span[value="2"]
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)

.progress-input-holder span[value="3"]
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(90deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)

.progress-input-holder span[value="4"]
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(90deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(0deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)
</style>
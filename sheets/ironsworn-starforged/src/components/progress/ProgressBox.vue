<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/sheet/stores/chronicle/progressStore';
import { ref } from 'vue';

const INPUTS = ['0', '1', '2', '3', '4']

const taskStore = useTaskStore()
const progress = ref('0')

const 


// TODO: Integrate Store

</script>

<template>
  <div class="progress-input-holder w-16 h-16 relative">
    <Select v-model="progress" @update:model-value="" class="w-16 h-16 absolute top-0 left-0">
      <SelectTrigger class="w-16 h-16 ">
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
      :value="progress"
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
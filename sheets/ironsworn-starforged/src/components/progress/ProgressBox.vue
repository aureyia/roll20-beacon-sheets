<script setup lang="ts">
import { ref } from 'vue';

const inputs = ['-', '+', '*', '#']

const nom = ref(0)

</script>

<template>
  <div class="progress-input-holder">
    <select class="progress-input" v-model="nom">
      <option value="0" selected></option>
      <option v-for="icon, index in inputs" :key="index" :value="index + 1">{{icon}}</option>
    </select>
    <input class="display-none" :value="nom" />
    <span></span>
  </div>
</template>

<style lang="sass">
.progress-input
  -webkit-appearance: none

.progress-input
  width: 5rem
  height: 5rem
  font-size: 20px
  font-weight: bold
  background: transparent
  text-align: center
  justify-content: center
  align-items: center
  padding: 0
  margin: 0px
  cursor: pointer
  border: 2px solid #4c4d4f
  border-radius: 0

.progress-input-holder input, input + span
  display: none
  position: absolute
  top: 0
  left: 0
  width: 5rem
  height: 5rem
  pointer-events: none
  background: #fff
  border: 2px solid #4c4d4f

.progress-input-holder input, 
input + span
  background: hsl(var(--primary-foreground))

.progress-input-holder input[value="1"]:valid + span
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px))

.progress-input-holder input[value="2"]:valid + span
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)

.progress-input-holder input[value="3"]:valid + span
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(90deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)

.progress-input-holder input[value="4"]:valid + span
  display: block
  background-image: linear-gradient(45deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(135deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(90deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%), linear-gradient(0deg, transparent 0px, transparent calc(50% - 1px), hsl(var(--primary)) calc(50% - 1px), hsl(var(--primary)) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)
</style>
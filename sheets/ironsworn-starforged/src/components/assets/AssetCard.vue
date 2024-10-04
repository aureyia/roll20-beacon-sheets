<script setup lang="ts">
import { CardFooter, Card, CardHeader, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox'
import { marked } from 'marked'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const props = defineProps({
  dataforgedAsset: {
    type: Object,
    required: true
  },
  storedAsset: {
    type: Object,
    required: true
  }
})
// TODO: Clean Up UI. Note!! You can't pass nested arrays to beacon. They need to be objectified. Also support tracks
const abilities = Object.values(props.storedAsset.abilities).filter((x) => x !== null)
console.log(abilities)
console.log(props.storedAsset)
</script>

<template>
  <Card class="asset-card w-[43%] mb-8 rounded-xlg drop-shadow border-0">
    <CardHeader class="bg-card-input font-bold text-xl rounded-t-lg drop-shadow">{{ dataforgedAsset.Name }}</CardHeader>
    <CardContent class="asset-body">
      <div 
        v-if="dataforgedAsset.Requirement" 
        class="mt-4 asset-requirement"
        >{{ dataforgedAsset.Requirement }}</div>
      <div class="abilities mt-4">
        <div class="flex mb-2" v-for="ability, index in dataforgedAsset.Abilities">
          <Checkbox class="mr-2 mt-1" v-model:checked="abilities[index].enabled"/>
          <div class="ability-text" data-i18n="key" v-html="marked.parse(ability.Text)"></div>
        </div>
      </div>
    </CardContent>
    <CardFooter v-if="storedAsset.meter">
      <ToggleGroup>
        <ToggleGroupItem
          v-for="value in Array.from(storedAsset.meter)"
          :value="value.toString()"
          >{{ value }}</ToggleGroupItem>
      </ToggleGroup>
    </CardFooter> 
  </Card>
</template>

<style lang="sass" scoped>
.asset-body
  font-family: "Encode sans"
</style>
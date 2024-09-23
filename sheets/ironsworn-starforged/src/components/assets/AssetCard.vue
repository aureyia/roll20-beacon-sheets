<script setup lang="ts">
import { CardFooter, Card, CardHeader, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox'
import { marked } from 'marked'


const props = defineProps({
  dataforgedAsset: Object,
  storedAsset: {
    type: Object,
    required: true
  },
  abilities: Array
})
// TODO: Clean Up UI. Note!! You can't pass nested arrays to beacon. They need to be objectified.
const abilities = props.storedAsset.abilities
console.log(props.abilities)
</script>

<template>
  <Card class="w-[45%] mb-8">
    <CardHeader>{{ dataforgedAsset.Name }}</CardHeader>
    <CardContent>
      <div 
        v-if="dataforgedAsset.Requirement" 
        class="asset-requirement"
        >{{ dataforgedAsset.Requirement }}</div>
      <div class="abilities mt-2">
        <div class="flex mb-2" v-for="ability, index in dataforgedAsset.Abilities">
          <Checkbox class="mr-2 mt-1" v-model:checked="Object.values(storedAsset.abilities)[index].enabled"/>
          <div class="ability-text" v-html="marked.parse(ability.Text)"></div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
    </CardFooter> 
  </Card>
</template>
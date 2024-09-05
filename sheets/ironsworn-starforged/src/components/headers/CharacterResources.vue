<template>
  <div class="character-resources row no-wrap shadow-2">
    <q-space/>
    <q-toolbar class="character-resource">
      <q-toolbar-title class="resource-title i18n-text" data-i18n="character-name">Character Name</q-toolbar-title>
      <q-input filled square class="resource-text" type="text" v-model.text="character.name" />
    </q-toolbar>
    <!-- <q-separator dark vertical /> -->
    <q-toolbar class="character-resource">
      <q-toolbar-title class="resource-title resource-callsign i18n-text" data-i18n="character-callsign">Callsign</q-toolbar-title>
      <q-input filled square class="resource-text" type="text" v-model.text="character.callsign" placeholder="callsign" />
    </q-toolbar>
    <!-- <q-separator dark vertical /> -->
    <q-toolbar class="character-resource">
      <q-toolbar-title class="resource-title resource-pronouns i18n-text" data-i18n="character-pronouns">Pronouns</q-toolbar-title>
      <q-input filled square class="resource-text" type="text" v-model.text="character.pronouns" placeholder="pronouns" />
    </q-toolbar>
    <!-- <q-separator dark vertical /> -->
    <q-toolbar class="character-resource">
      <q-toolbar-title class="resource-title i18n-text" data-i18n="character-experience">XP</q-toolbar-title>
      <q-input filled square class="resource-number" type="number" v-model.text="character.currentXp" value="0" />
    </q-toolbar>
    <!-- <q-separator dark vertical /> -->
    <q-toolbar class="character-resource">
      <q-toolbar-title class="resource-title i18n-text" data-i18n="character-experience-spent">Spent</q-toolbar-title>
      <q-input filled square class="resource-number" type="number" v-model.text="character.spentXp" value="0" />
    </q-toolbar>
    <q-space/>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { useCharacterStore } from '../../sheet/stores/character/characterStore';

const character = useCharacterStore();

</script>

<style lang="sass" scoped>
.character-resources
  justify-content: space-around 

.character-resources
  background-color: white
  height: 28px

.resource-pronouns,
.resource-callsign 
  widows: 2em

.resource-number
  width: 4em

div.q-toolbar.character-resource
  width: fit-content
  min-height: auto

div.q-toolbar__title.resource-title 
  font-size: 1.2em
  color: rgb(20, 20, 20)

div.q-field__control,
div.q-field__control 
  height: 28px

</style>
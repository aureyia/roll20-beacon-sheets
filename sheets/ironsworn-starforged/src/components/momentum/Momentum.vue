<template>
  <q-toolbar>
    <q-separator vertical dark />
    <q-toolbar-title align="right" class="footer-title">Momentum</q-toolbar-title>
    <q-btn-toggle
      unelevated
      rounded
      v-model="character.momentum"
      toggle-color="secondary"
      toggle-text-color="white"
      color="primary"
      text-color="white"
      class="my-custom-toggle"
      :options="options"
    />
    <q-btn rounded color='secondary' class="momentum-burn" @click="resetMomentum()">Burn: {{ character.momentumReset }}</q-btn>
    <span class="momentum-max">Max: {{ character.momentumMax }}</span>
    <q-separator vertical dark />
  </q-toolbar>
</template>

<script setup>
import { useCharacterStore } from '../../sheet/stores/character/characterStore';

const character = useCharacterStore();

let options = Array.from({length: character.momentumMax + 7}, (_, i) => i - 6).map((index) => {
  return {label: `${index}`, value: index}
})

function resetMomentum() {
  if (character.momentum > character.momentumReset) {
    return character.momentum = character.momentumReset
  }
}
</script>

<style lang="sass">
div.q-toolbar__title.footer-title
  font-size: 1.1em
.my-custom-toggle
  border: 1px solid white
  .q-btn:not(:last-child)
    border-right: 1px solid white
.momentum-burn
  margin-right: 1em
  margin-left: 1em
.momentum-max
  margin-right: 1em
</style>
<script setup lang="ts">
import { computed } from 'vue';
import StatCard from '@/components/cards/StatCard.vue';
import { useStatsStore } from '@/sheet/stores/stats/statsStore';
import { useCharacterStore } from '@/sheet/stores/character/characterStore';
import { useImpactsStore } from '@/sheet/stores/impacts/impactsStore';
import { useMetaStore } from '@/sheet/stores/meta/metaStore';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import LabelledInput from '@/components/info/LabelledInput.vue';

const statsStore = useStatsStore()
const character = useCharacterStore();
const impacts = useImpactsStore();
const meta = useMetaStore();
const resources = useResourcesStore();
</script>

<template>
  <div class="summary">
    <div class="descriptors">
      <CharacterInfo :name="meta.name" :callsign="character.callsign" :pronouns="character.pronouns"/>
      <div class="character-info">
        <LabelledInput label="Name" v-model="meta.name"/>
        <LabelledInput label="Callsign" v-model="character.callsign"/>
        <LabelledInput label="Pronouns" v-model="character.pronouns"/>
      </div>
      <div class="resources">
        <Resource v-for="resource in resources" :key="resource" :resource="resource"/>
      </div>
    </div>
    <div class="stats flex justify-center gap-3">
      <StatCard v-for="(stat, key) in statsStore.stats" :key="stat" :name="key" :stat="stat"/>
    </div>
    <div class="impacts">

    </div>
  </div>
</template>
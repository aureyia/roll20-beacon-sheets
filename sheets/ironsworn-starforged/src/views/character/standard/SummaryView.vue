<script setup lang="ts">
import { Button } from '@/components/ui/button';
import StatCard from '@/components/cards/StatCard.vue';
import LabelledInput from '@/components/inputs/LabelledInput.vue';
import LabelledSwitch from '@/components/switches/LabelledSwitch.vue';
import LabelledNumberField from '@/components/inputs/LabelledNumberField.vue';
import { ImpactCategory } from '@/components/impacts';
import { useStatsStore, type Stats } from '@/sheet/stores/stats/statsStore';
import { useCharacterStore } from '@/sheet/stores/character/characterStore';
import { useMetaStore } from '@/sheet/stores/meta/metaStore';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { Toggle } from '@/components/ui/toggle/index';
import { ref } from 'vue';
import { IMPACTS } from '@/system/impacts';

import { ImpactDialog } from '@/components/impacts';

const stats: Stats = useStatsStore();
const character = useCharacterStore();
const meta = useMetaStore();
const resources = useResourcesStore();

const toggleStatsEdit = ref(false);
const toggleImpactRemoval = ref(false);

const statList = ['edge', 'heart', 'iron', 'shadow', 'wits'];
</script>

<template>
  <div class="summary mx-10">
    <div class="descriptors">
      <div class="character-info flex gap-6 flex-row m-3">
        <LabelledInput class="flex basis-2/4" label="Name" v-model="meta.name" />
        <LabelledInput class="flex basis-1/4" label="Callsign" v-model="character.callsign" />
        <LabelledInput class="flex basis-1/4" label="Pronouns" v-model="character.pronouns" />
      </div>
      <div class="resources gap-6 flex flex-row m-3">
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Health"
          v-model="resources.health"
          :max="5"
          :min="0"
        />
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Spirit"
          v-model="resources.spirit"
          :max="5"
          :min="0"
        />
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Supply"
          v-model="resources.supply"
          :max="5"
          :min="0"
        />
        <LabelledNumberField class="flex basis-1/4" type="number" label="XP" v-model="resources.xp" />
        <LabelledSwitch class="flex basis-1/4" label="Edit Stats" v-model="toggleStatsEdit" />
      </div>
    </div>
    <div class="stats flex justify-center gap-5 mt-10" v-if="toggleStatsEdit">
      <LabelledNumberField
        class="text-center"
        v-for="stat in statList"
        :key="stat"
        :label="stat"
        v-model="stats[stat as keyof Stats]"
        input-modifier="py-12 font-bold text-2xl"
      />
    </div>
    <div class="stats flex justify-center gap-5 mt-10" v-else>
      <StatCard
        v-for="stat in statList"
        :key="stat"
        :name="stat"
        :stat="stats[stat as keyof Stats]"
        number-style="text-3xl"
      />
    </div>
    <div class="impacts mt-10">
      <div class="impacts-header flex justify-center gap-10 items-center">
        <Toggle class= "text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary/90 data-[state=on]:bg-destructive" v-model:pressed="toggleImpactRemoval">Remove</Toggle>
        <h3 class="text-2xl">Impacts</h3>
        <ImpactDialog />
      </div>
      <div class="flex justify-evenly gap-3 text-center mt-8">
        <ImpactCategory
          v-for="category in Object.keys(IMPACTS)"
          :key="category"
          :label="category"
          v-model="toggleImpactRemoval"
        />
        <ImpactCategory label="other" v-model="toggleImpactRemoval" />
      </div>
    </div>
  </div>
</template>

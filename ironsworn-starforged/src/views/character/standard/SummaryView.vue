<script setup lang="ts">
import StatCard from '@/components/cards/StatCard.vue';
import LabelledInput from '@/components/inputs/LabelledInput.vue';
import LabelledSwitch from '@/components/switches/LabelledSwitch.vue';
import LabelledNumberField from '@/components/inputs/LabelledNumberField.vue';
import { ImpactCategory } from '@/components/impacts';
import { statsStore, type Stats } from '@/system/stats/store';
import { characterStore } from '@/system/character/store';
import { metaStore } from '@/external/store';
import { resourcesStore } from '@/system/resources/store';
import { Toggle } from '@/components/ui/toggle/index';
import { ref } from 'vue';
import { IMPACTS } from '@/system/impacts/types';
import { STAT_LIST } from '@/system/stats/stats';

import { ImpactDialog } from '@/components/impacts';

const stores = {
  meta: metaStore,
  character: characterStore,
  resources: resourcesStore,
  stats: statsStore,
};

const toggleStatsEdit = ref(false);
const toggleImpactRemoval = ref(false);

const character = ref(stores.character.get().context);
const name = ref(stores.meta.get().context.name);
const stats = ref(stores.stats.get().context);
const resources = ref(stores.resources.get().context);

characterStore.subscribe((snapshot) => {
  character.value = snapshot.context;
});

resourcesStore.subscribe((snapshot) => {
  resources.value = snapshot.context;
});

statsStore.subscribe((snapshot) => {
  stats.value = snapshot.context;
});

type Store = keyof typeof stores;

const update = (store: Store, label: any, event: any) => {
  stores[store].trigger.set({ label, value: event });
};
</script>

<template>
  <div class="summary mx-10">
    <div class="descriptors">
      <div class="character-info m-3 flex flex-row gap-6">
        <LabelledInput
          class="flex basis-2/4"
          label="Name"
          :modelValue="name"
          @update:modelValue="(event: string) => update('meta', 'name', event)"
        />
        <LabelledInput
          class="flex basis-1/4"
          label="Callsign"
          :modelValue="character.callsign"
          @update:modelValue="
            (event: string) => update('character', 'callsign', event)
          "
        />
        <LabelledInput
          class="flex basis-1/4"
          label="Pronouns"
          :modelValue="character.pronouns"
          @update:modelValue="
            (event: string) => update('character', 'pronouns', event)
          "
        />
      </div>
      <div class="resources m-3 flex flex-row gap-6">
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Health"
          :modelValue="resources.health"
          @update:modelValue="
            (event: number) => update('resources', 'health', event)
          "
          :max="5"
          :min="0"
        />
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Spirit"
          :modelValue="resources.spirit"
          @update:modelValue="
            (event: number) => update('resources', 'spirit', event)
          "
          :max="5"
          :min="0"
        />
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="Supply"
          :modelValue="resources.supply"
          @update:modelValue="
            (event: number) => update('resources', 'supply', event)
          "
          :max="5"
          :min="0"
        />
        <LabelledNumberField
          class="flex basis-1/4"
          type="number"
          label="XP"
          :modelValue="resources.xp"
          @update:modelValue="
            (event: number) => update('resources', 'xp', event)
          "
        />
        <LabelledSwitch
          class="flex basis-1/4"
          label="Edit Stats"
          v-model="toggleStatsEdit"
        />
      </div>
    </div>
    <div class="stats mt-10 flex justify-center gap-5" v-if="toggleStatsEdit">
      <LabelledNumberField
        class="text-center"
        v-for="stat in STAT_LIST"
        :key="stat"
        :label="stat"
        :modelValue="stats[stat]"
        @update:modelValue="(event: number) => update('stats', stat, event)"
        input-modifier="py-12 font-bold text-2xl"
      />
    </div>
    <div class="stats mt-10 flex justify-center gap-5" v-else>
      <StatCard
        v-for="stat in STAT_LIST"
        :key="stat"
        :name="stat"
        :stat="stats[stat as keyof Stats]"
        number-style="text-3xl"
      />
    </div>
    <div class="impacts mt-10">
      <div class="impacts-header flex items-center justify-center gap-10">
        <Toggle
          class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground data-[state=on]:bg-destructive"
          v-model="toggleImpactRemoval"
          >Remove</Toggle
        >
        <h3 class="text-2xl">Impacts</h3>
        <ImpactDialog />
      </div>
      <div class="mt-8 flex justify-evenly gap-3 text-center">
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

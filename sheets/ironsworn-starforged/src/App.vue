<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="primary text-white">
      <!-- <CharacterResources /> -->
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleleftDrawer" />
        <q-space/>
        <q-tabs>
          <q-route-tab v-for="item in navList" :to="`/${item}`" :label="capitalizeFirstLetter(item)"/>
        </q-tabs>
        <q-space/>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above elevated v-model="leftDrawerOpen" side="left">
      Vows
    </q-drawer>
    <q-drawer show-if-above elevated v-model="rightDrawerOpen" side="right">
      Assets
    </q-drawer>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <q-footer elevated class="primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleleftDrawer" />
        <q-space/>
        <Momentum />
        <q-space/>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useStarforgedSheetStore } from './sheet/stores';
import CharacterResources from '@/components/headers/CharacterResources.vue';
import Momentum from '@/components/momentum/Momentum.vue'
import { ref } from 'vue'

const rightDrawerOpen = ref(false)
const leftDrawerOpen = ref(false)
const store = useStarforgedSheetStore();
const campaignId = store.meta.campaignId;
const navList = [
  'summary',
  'moves',
  'oracles',
  'vows',
  'ship',
  'assets',
  'progress',
  'connections',
  'legacies',
  'settings',
]

function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

function toggleleftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<style scoped lang="scss">
</style>

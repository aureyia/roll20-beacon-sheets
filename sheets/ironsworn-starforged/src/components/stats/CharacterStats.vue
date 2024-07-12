<template>
  <div>
    <div class="stats-static">
      <StatStatic v-for="stat in statList" :stat="stat" />
    </div>
    <div class="stats-editor">
      <StatEditor v-for="stat in statList" :stat="stat" />
    </div>
    <div class="edit-button">

    </div>
  </div>
</template>

<script setup>
import StatStatic from '@/components/stats/StatStatic.vue';
import StatEditor from '@/components/stats/StatEditor.vue';

const statList = [
  'edge',
  'heart',
  'iron',
  'shadow',
  'wits'
]
</script>
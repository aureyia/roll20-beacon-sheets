<template>
  <div class="stats-view row fit">
    <div class="col stats-spacer"></div>
    <div class="stats-static-view col row justify-between" v-if="!editMode">
      <StatStatic />
    </div>
    <div class="stats-editor-view col row justify-between" v-if="editMode">
      <StatEditor />
    </div>
    <div class="stats-toggle col justify-center">
      <q-toggle color="primary" class="edit-button" v-model="editMode" label="Edit"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatStatic from '@/components/stats/StatStatic.vue';
import StatEditor from '@/components/stats/StatEditor.vue';

const editMode = ref(false);

</script>

<style scoped lang="sass">
div.stats-editor-view,
div.stats-static-view
  min-width: 55em
  min-height: 10em
  align-content: center

.stats-toggle
  display: flex
</style>
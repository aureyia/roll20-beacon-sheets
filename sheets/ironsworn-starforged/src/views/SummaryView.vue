
<template>
  <div class="summary">
    <CharacterStats />
    <CharacterImpacts />
    <CharacterNotes />
  </div>
</template>
  
<script setup>
import { useExampleSheetStore } from '@/sheet/stores';
import CharacterStats from '@/components/stats/CharacterStats.vue';
import CharacterImpacts from '@/components/impacts/CharacterImpacts.vue';
import CharacterNotes from '@/components/notes/CharacterNotes.vue';

useExampleSheetStore();
</script>

<style lang="scss">
@use '../common/scss/vars.scss' as vars;

.summary {
  &__header {
    // todo avatar, name
  }

  &__main {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
      grid-template-columns: 33rem 33rem 20rem;
  }

  &__column {
      display: grid;
      gap: 1rem;
  }

  &__inventory {
      width: 88rem;
  }
}
</style>
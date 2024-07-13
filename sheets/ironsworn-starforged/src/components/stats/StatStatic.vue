<template>
  <div class="stats-static">
    <div class="stat" v-for="(value, label) in stats" :key="label">
      <q-btn rounded outline class="stat-button" size="2em" @click="() => rollStat(label, value)">
        <div class="stats-title i18n-text" :data-i18n="`stat-${label}`">
          {{ capitalizeFirstLetter(label) }}
          <br>
          {{ value }}
        </div>
      </q-btn>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { computed } from 'vue';
  import { useStatsStore } from '../../sheet/stores/stats/statsStore';

  const statsStore = useStatsStore();
  const stats = computed(() => statsStore.stats);

  const rollStat = (label: string, value: number) => {
    console.log('I will roll:', {[label]: value})
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

</script>

<style scoped lang="scss">
.stats-static {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.stat {
  width: fit-content;
  justify-content: center;
  align-items: center;
  margin: 1em;
}

.stat-button {
  padding: 0.2em;
  width: 6em;
}
// .roll-label {
//   margin: 0;
//   padding: 0.1em 0.4em;
//   width: auto;
//   cursor: pointer;
//   text-align: center;
//   line-height: 1.4em;
//   border-radius: 1em;
// }

// .stat {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin: 1em;
// }

// .stats-input {
//   font-weight: bold;
//   width: 60px;
//   line-height: 40px;
//   font-size: 28px;
//   text-align: center;
//   height: 50px;
//   border-radius: 0;
// }
</style>
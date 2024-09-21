<script setup lang="ts">
import { useStarforgedSheetStore } from '@/sheet/stores';
import { useRouter } from 'vue-router';
import DarkModeSwitch from './components/switches/DarkModeSwitch.vue';

// TODO: Remove after testing
import { useSettingsStore } from '@/sheet/stores/settings/settingsStore';
const settings = useSettingsStore();
const router = useRouter();

const clear = () => {
  settings.clearMode();
  router.push({ path: '/' });
};

useStarforgedSheetStore();
router.push({ name: settings.mode ?? 'root' });
</script>

<template>
  <!-- <Button variant="secondary" i18n="" @click="clear">Reset</Button> -->
  <!-- <div>{{ settings.mode }}</div> -->
  <div class="starforged mt-20">
    <router-view />
  </div>
</template>

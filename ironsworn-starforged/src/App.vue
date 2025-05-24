<script setup lang="ts">
import { useStarforgedSheetStore } from '@/external/sheet-store';
import { useRouter } from 'vue-router';

// TODO: Remove after testing
import { useSettingsStore } from '@/system/settings/store';
const settings = useSettingsStore();
const router = useRouter();

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

<script setup lang="ts">
import { useRouter } from 'vue-router';

// TODO: Remove after testing
import { settingsStore } from '@/system/settings/store.x';
const router = useRouter();

router.push({ name: settingsStore.get().context.mode ?? 'root' });
</script>

<template>
  <!-- <Button variant="secondary" i18n="" @click="clear">Reset</Button> -->
  <!-- <div>{{ settings.mode }}</div> -->
  <div class="starforged mt-20">
    <router-view />
  </div>
</template>

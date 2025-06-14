<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { settingsStore, type Settings } from '@/system/settings.store';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectMode = (mode: Settings['mode']) => {
  settingsStore.trigger.set({ label: 'mode', value: mode });
  router.push({ name: mode });
};

defineProps({
  mode: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="mode-card m-2">
    <Card>
      <CardHeader>
        <CardTitle i18n="mode-card-character-standard-title">{{
          mode
        }}</CardTitle>
        <CardDescription i18n="mode-card-character-standard-description">{{
          mode
        }}</CardDescription>
      </CardHeader>
      <CardContent i18n="">{{ mode }} image</CardContent>
      <CardFooter>
        <Button
          i18n="button-text-select"
          @click="selectMode(mode as Settings['mode'])"
          >Select</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>

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
import { useSettingsStore } from '@/internal/settings/infrastructure/store';
import { useRouter } from 'vue-router';

const settings = useSettingsStore();
const router = useRouter();
const selectMode = (mode: string) => {
  settings.setMode(mode);
  console.log('selectMode', mode);
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
        <Button i18n="button-text-select" @click="selectMode(mode)"
          >Select</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>

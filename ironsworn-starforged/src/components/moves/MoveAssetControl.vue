<script setup lang="ts">
import { assetsStore } from '@/system/assets/store';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Toggle } from '../ui/toggle';

const assetStore = assetsStore.get().context.list;
</script>

<template>
  <div class="move-asset-control">
    <div class="text-lg">Assets</div>
    <Card v-for="asset in assetStore.assets" class="mb-2">
      <CardTitle class="mt-1 mb-2 ml-2 text-base">{{ asset.name }}</CardTitle>
      <CardContent class="text-sm">
        <div
          class="ability-container mb-2"
          v-for="(ability, index) in asset.abilities"
        >
          <Toggle
            v-if="ability.enabled === true"
            class="hover:text-color-primary border-primary hover:bg-destructive/[0.3] data-[state=on]:bg-destructive/[0.6] w-full border-2 border-solid"
          >
            Ability {{ index + 1 }}
          </Toggle>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

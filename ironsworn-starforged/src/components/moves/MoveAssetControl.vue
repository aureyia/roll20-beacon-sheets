<script setup lang="ts">
import { useAssetStore } from '@/sheet/stores/assets/assetStore';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Toggle } from '../ui/toggle';

const assetStore = useAssetStore()
</script>

<template>
  <div class="move-asset-control">
    <div class="text-lg">Assets</div>
    <Card 
      v-for="asset in assetStore.assets"
      class="mb-2"
    >
      <CardTitle class="text-base ml-2 mt-1 mb-2">{{ asset.name }}</CardTitle>
      <CardContent class="text-sm">
        <div
          class="ability-container mb-2" 
          v-for="ability, index in asset.abilities"
        >
          <Toggle
            v-if="ability.enabled === true"
            class="data-[state=on]:bg-destructive/[0.6] hover:bg-destructive/[0.3] hover:text-color-primary border-2 border-solid border-primary w-full"
          >
            Ability {{ index + 1 }}
          </Toggle> 
        </div>
      </CardContent>
    </Card>
  </div>  
</template>
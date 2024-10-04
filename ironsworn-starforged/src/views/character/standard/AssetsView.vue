<script setup lang="ts">
import { ref } from 'vue';
import { useAssetStore, type Asset } from '@/sheet/stores/assets/assetStore';
import { starforged, type IAsset } from 'dataforged';
import { pipe } from 'effect'

const assetStore = useAssetStore();
const removeMode = ref(false);


const getAssetById = (asset: Asset) =>
  starforged['Asset Types']
    .find((x) => x.Name === asset.category)?.Assets
    .find((x) => x.$id === asset.dataforgedId)
</script>

<template>
  <div class="assets mx-20 mb-10">
    <div class="asset-control mb-4">
      <AssetAddDialog />
      <div>
        <Toggle
          class="h-8 w-24 border-2 border-primary font-bold data-[state=on]:bg-destructive"
          v-model:pressed="removeMode"
          >Remove
        </Toggle>
      </div>
    </div>
    <div class="assets-container flex flex-wrap justify-between">
      <AssetCard v-for="asset in assetStore.assets" :abilities="asset.abilities" :storedAsset="asset" :dataforgedAsset="getAssetById(asset)"/>
    </div>
  </div>
</template>

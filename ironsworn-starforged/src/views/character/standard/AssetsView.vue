<script setup lang="ts">
import { ref } from 'vue';
import { assetsStore } from '@/system/assets/store';
// @ts-ignore
import { starforged, type IAsset } from 'dataforged';
import { Effect } from 'effect';
import AssetAddDialog from '@/components/assets/AssetAddDialog.vue';
import AssetCard from '@/components/assets/AssetCard.vue';

const assetStore = ref(assetsStore.get().context);
const removeMode = ref(false);

const getAssetById = (asset: IAsset) => {
  const assets = starforged['Asset Types'].find(
    (x: IAsset) => x.Name === asset.category,
  ).Assets;
  if (!assets) {
    return Effect.fail(
      new Error(`No assets found for category: ${asset.category}`),
    );
  }

  const selectedAsset = assets.find(
    (x: IAsset) => x.$id === asset.dataforgedId,
  );

  if (!selectedAsset) {
    return Effect.fail(new Error(`No asset found for: ${asset.dataforgedId}`));
  }

  return Effect.succeed(selectedAsset);
};
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
      <AssetCard
        v-for="asset in assetStore.assets"
        :abilities="asset.abilities"
        :storedAsset="asset"
        :dataforgedAsset="Effect.runSync(getAssetById(asset))"
        :key="asset"
      />
    </div>
  </div>
</template>

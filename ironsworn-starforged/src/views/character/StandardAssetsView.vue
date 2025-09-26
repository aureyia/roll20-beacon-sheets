<script setup lang="ts">
import { Effect } from 'effect'
import { ref } from 'vue'
import AssetAddDialog from '@/components/assets/AssetAddDialog.vue'
import AssetCard from '@/components/assets/AssetCard.vue'
import { store_assets } from '@/system/assets_store'
// @ts-ignore
import type { IAsset } from '@/system/dataforged/types'
import { starforged } from '@/system/dataforged'

const storeAssetList = () => store_assets.get().context.list
const removeMode = ref(false)

const getAssetById = (asset: any) => {
    const assets = starforged['Asset Types'].find(
        (x: IAsset) => x.Name === asset.category
    ).Assets
    if (!assets) {
        return Effect.fail(
            new Error(`No assets found for category: ${asset.category}`)
        )
    }

    const selectedAsset = assets.find(
        (x: IAsset) => x.$id === asset.id_dataforged
    )

    if (!selectedAsset) {
        return Effect.fail(
            new Error(`No asset found for: ${asset.id_dataforged}`)
        )
    }

    console.log('selectedAsset', selectedAsset)

    return Effect.succeed(selectedAsset)
}

const assets = ref(storeAssetList())
</script>

<template>
  <div class="assets mx-20 mb-10">
    <div class="asset-control mb-4">
      <AssetAddDialog />
      <div>
        <Toggle
          class="border-primary data-[state=on]:bg-destructive h-8 w-24 border-2 font-bold"
          v-model:pressed="removeMode"
          >Remove
        </Toggle>
      </div>
    </div>
    <div class="assets-container flex flex-wrap justify-between">
      <AssetCard
        v-for="(asset, key) in storeAssetList()"
        v-model:abilities="assets[key].abilities"
        v-model:asset_stored="assets[key]"
        :dataforgedAsset="Effect.runSync(getAssetById(asset))"
        :key="asset._id"
      />
    </div>
  </div>
</template>

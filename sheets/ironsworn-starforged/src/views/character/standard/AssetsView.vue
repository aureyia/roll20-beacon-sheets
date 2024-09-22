<script setup lang="ts">
import { ref } from 'vue';
import { useAssetStore } from '@/sheet/stores/assets/assetStore';

const assetStore = useAssetStore();
const removeMode = ref(false);
</script>

<template>
  <div class="assets">
    <div class="asset-control">
      <AssetAddDialog />
      <div>
        <Toggle
          class="h-8 w-24 border-2 border-primary font-bold data-[state=on]:bg-destructive"
          v-model:pressed="removeMode"
          >Remove
        </Toggle>
      </div>
    </div>
    <div>{{ assetStore.assets }}</div>
    <AssetList />
  </div>
</template>

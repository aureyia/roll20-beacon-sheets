<script setup lang="ts">
import { marked } from 'marked'
import { store_assets } from '@/system/assets_store'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

defineProps({
    dataforgedAsset: {
        type: Object,
        required: true,
    },
})

const abilities = defineModel('abilities', { required: true })
const asset_stored = defineModel('asset_stored', { required: true })

const ability_update = (event: any) => {
    store_assets.trigger.ability_update(event)
}
</script>

<template>
  <Card class="asset-card rounded-xlg mb-8 w-[43%] border-0 drop-shadow-sm">
    <CardHeader
      class="bg-card-input rounded-t-lg text-xl font-bold drop-shadow-sm"
      >{{ dataforgedAsset.Name }}</CardHeader
    >
    <CardContent class="asset-body">
      <div v-if="dataforgedAsset.Requirement" class="asset-requirement mt-4">
        {{ dataforgedAsset.Requirement }}
      </div>
      <div class="abilities mt-4">
        <div
          class="mb-2 flex"
          v-for="(ability, index) in dataforgedAsset.Abilities"
        >
          <Checkbox
            class="mt-1 mr-2"
            v-model="abilities[index].enabled"
            @update:model-value="
              (event) =>
                ability_update({
                  assetId: asset_stored._id,
                  id_ability: abilities[index]._id,
                  value: event,
                })
            "
          />
          <div
            class="ability-text"
            data-i18n="key"
            v-html="marked.parse(ability.Text)"
          ></div>
        </div>
      </div>
    </CardContent>
    <CardFooter v-if="asset_stored.meter">
      <ToggleGroup>
        <ToggleGroupItem
          v-for="value in Array.from(asset_stored.meter)"
          :value="value.toString()"
          >{{ value }}</ToggleGroupItem
        >
      </ToggleGroup>
    </CardFooter>
  </Card>
</template>

<style lang="sass" scoped>
.asset-body
  font-family: "Encode sans"
</style>

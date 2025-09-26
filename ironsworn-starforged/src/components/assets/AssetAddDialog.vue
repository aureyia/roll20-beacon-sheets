<script setup lang="ts">
import { Effect } from 'effect'
import { DialogFooter } from '@/components/ui/dialog'
import { FormControl } from '@/components/ui/form'
import { type AssetSubmission, store_assets } from '@/system/assets_store'
import type { AssetCategory } from '@/system/assets_types'
import { getAllAssetsForCategory } from '@/system/assets_utils'
import type { IAsset } from '@/system/dataforged/types'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { FormField, FormItem, FormLabel } from '../ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'

const CATEGORIES: AssetCategory[] = ['Path', 'Companion', 'Deed'] as const

const formSchema = toTypedSchema(
    z
        .object({
            category: z.string().min(2),
            asset: z.string(),
        })
        .required()
)

type SupportedAssets = {
    Path: IAsset[]
    Companion: IAsset[]
    Deed: IAsset[]
    [key: string]: IAsset[]
}

const getAllAssets = () =>
    Effect.gen(function* () {
        return {
            Path: yield* getAllAssetsForCategory('Path'),
            Companion: yield* getAllAssetsForCategory('Companion'),
            Deed: yield* getAllAssetsForCategory('Deed'),
        }
    })

const form = useForm({
    validationSchema: formSchema,
})

const allAssets = Effect.runSync(getAllAssets())

const onSubmit = form.handleSubmit(values => {
    const selectedAsset = allAssets[values.category].find(
        (asset: IAsset) => asset.Name === values.asset
    )

    if (!selectedAsset) {
        return
    }

    const submission: AssetSubmission = {
        dataforged_id: selectedAsset.$id,
        name: values.asset,
        category: values.category as AssetSubmission['category'],
        meter: null,
    }

    store_assets.trigger.add(submission)
})

const clearState = () => {
    store_assets.trigger.clear()
}
</script>

<template>
  <Button @click="clearState()">Clear</Button>
  <Dialog>
    <DialogTrigger as-child>
      <Button>Add</Button>
    </DialogTrigger>
    <DialogContent>
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Select an Asset</DialogTitle>
        </DialogHeader>
        <FormField v-slot="{ componentField }" name="category">
          <FormItem class="mt-2">
            <FormLabel>Select asset category</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-for="category in CATEGORIES">
                    <SelectItem :value="category">
                      <SelectLabel class="pl-0">{{ category }}</SelectLabel>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="asset">
          <FormItem class="mt-2">
            <FormLabel>Asset</FormLabel>
            <FormControl>
              <Select :disabled="!form.values.category" v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-for="asset in allAssets[form.values.category]">
                    <SelectItem :value="asset.Name">
                      <SelectLabel>{{ asset.Name }}</SelectLabel>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter class="mt-2">
          <DialogClose>
            <Button type="submit">Add</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

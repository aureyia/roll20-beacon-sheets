<script setup lang="ts">
import { Effect, Schema } from 'effect'
import { useForm, Field as VeeField } from 'vee-validate'
import { DialogFooter } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { type AssetSubmission, store_assets } from '@/system/assets_store'
import type { AssetCategory } from '@/system/assets_types'
import { getAllAssetsForCategory } from '@/system/assets_utils'
import type { IAsset } from '@/system/dataforged/types'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const CATEGORIES: AssetCategory[] = ['Path', 'Companion', 'Deed'] as const

const form_schema = toTypedSchema(z.object({
    category: z.string().min(2).max(50),
    asset: z.string().min(2).max(50),
}))

// type SupportedAssets = {
//     Path: IAsset[]
//     Companion: IAsset[]
//     Deed: IAsset[]
//     [key: string]: IAsset[]
// }

const getAllAssets = () =>
    Effect.gen(function* () {
        return {
            Path: yield* getAllAssetsForCategory('Path'),
            Companion: yield* getAllAssetsForCategory('Companion'),
            Deed: yield* getAllAssetsForCategory('Deed'),
        }
    })

const form = useForm({
  validationSchema: form_schema,
})

const allAssets = Effect.runSync(getAllAssets())

const onSubmit = form.handleSubmit(values => {
    console.log(values)
    const selectedAsset = allAssets[values.category].find(
        (asset: IAsset) => asset.Name === values.asset
    )

    console.log('selectedAsset', selectedAsset)

    if (!selectedAsset) {
        return
    }

    const submission: AssetSubmission = {
        dataforged_id: selectedAsset.$id,
        name: values.asset,
        category: values.category as AssetSubmission['category'],
        meter: null,
    }

    console.log('submission', submission)
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
        <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="category">
                <Field :data-invalid="!!errors.length">
                    <FieldContent>
                        <FieldLabel>
                            Select asset category
                        </FieldLabel>
                        <FieldError v-if="errors.length" :errors="errors" />
                    </FieldContent>
                    <Select
                        :model-value="field.value"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                    >
                        <SelectTrigger :aria-invalid="!!errors.length">
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
                </Field>
            </VeeField>
            <VeeField v-slot="{ field, errors }" name="asset">
                <Field :data-invalid="!!errors.length">
                    <FieldContent>
                        <FieldLabel>
                            Select asset
                        </FieldLabel>
                        <FieldError v-if="errors.length" :errors="errors" />
                    </FieldContent>
                    <Select
                        :model-value="field.value"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                        :disabled="!form.values.category"
                    >
                        <SelectTrigger :aria-invalid="!!errors.length">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup v-for="asset in allAssets[form.values.category]">
                                <SelectItem :value="asset.Name">
                                    <SelectLabel class="pl-0">{{ asset.Name }}</SelectLabel>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </VeeField>
        </FieldGroup>
        <DialogFooter class="mt-2">
          <DialogClose>
            <Button type="submit">Add</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
    </Dialog>
</template>

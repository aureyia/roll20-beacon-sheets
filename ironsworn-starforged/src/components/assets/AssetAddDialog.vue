<script setup lang="ts">
import * as z from 'zod';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormField, FormItem, FormLabel } from '../ui/form';
import { type IAsset } from 'dataforged';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  useAssetStore,
  type AssetSubmission,
} from '@/system/assets/store';
import { getAllAssetsForCategory } from '@/system/assets/fetching-assets';
import type { AssetCategory } from '@/system/assets/types';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Effect } from 'effect';
import { FormControl } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';

const CATEGORIES: AssetCategory[] = ['Path', 'Companion', 'Deed'] as const;
const assetStore = useAssetStore();

const formSchema = toTypedSchema(
  z
    .object({
      category: z.string().min(2),
      asset: z.string(),
    })
    .required(),
);

type SupportedAssets = {
  Path: IAsset[];
  Companion: IAsset[];
  Deed: IAsset[];
  [key: string]: IAsset[];
};

const allAssets: SupportedAssets = {
  Path: Effect.runSync(getAllAssetsForCategory('Path')),
  Companion: Effect.runSync(getAllAssetsForCategory('Companion')),
  Deed: Effect.runSync(getAllAssetsForCategory('Deed')),
};

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  const selectedAsset = allAssets[values.category].find(
    (asset: IAsset) => asset.Name === values.asset,
  );

  if (!selectedAsset) {
    return;
  }

  const submission: AssetSubmission = {
    dataforgedId: selectedAsset.$id,
    name: values.asset,
    // @ts-ignore
    category: values.category,
  };
  console.log('nom');
  assetStore.addAsset(submission);
});

const clearState = () => {
  assetStore.assets = [];
};
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

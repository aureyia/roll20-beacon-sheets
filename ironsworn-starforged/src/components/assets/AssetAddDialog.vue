<script setup lang="ts">
import * as z from 'zod';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormField, FormItem, FormLabel } from '../ui/form';
import { type IAsset } from '@/vendor/dataforged';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { assetsStore, type AssetSubmission } from '@/system/assets/store';
import { getAllAssetsForCategory } from '@/system/assets/fetching-assets';
import type { AssetCategory } from '@/system/assets/types';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Effect } from 'effect';
import { FormControl } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import type { an } from 'vitest/dist/chunks/reporters.d.DG9VKi4m.js';

const CATEGORIES: AssetCategory[] = ['Path', 'Companion', 'Deed'] as const;

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

const getAllAssets = () =>
  Effect.gen(function* () {
    return {
      Path: yield* getAllAssetsForCategory('Path'),
      Companion: yield* getAllAssetsForCategory('Companion'),
      Deed: yield* getAllAssetsForCategory('Deed'),
    };
  });

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  const allAssets = Effect.runSync(getAllAssets());
  const selectedAsset = allAssets[values.category].find(
    (asset: IAsset) => asset.Name === values.asset,
  );

  if (!selectedAsset) {
    return;
  }

  const submission: AssetSubmission = {
    dataforgedId: selectedAsset.$id,
    name: values.asset,
    category: values.category as AssetSubmission['category'],
    meter: null,
  };

  assetsStore.trigger.add(submission);
});

const clearState = () => {
  assetsStore.trigger.clear();
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

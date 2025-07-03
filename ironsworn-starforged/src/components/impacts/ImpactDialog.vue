<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Dialog,
    DialogFooter,
} from '@/components/ui/dialog'
import { IMPACTS, type AnyImpact } from '@/system/impacts_types'
import { store_impacts, type AddImpact } from '@/system/impacts_store'

const fullImpactList = {
    ...IMPACTS,
    other: '',
}

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2).max(50),
        category: z.string().min(1).max(50),
        description: z.string().optional(),
    })
)

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(values => {
    store_impacts.trigger.add({ ...values } as AddImpact)
})
</script>

<template>
  <div class="impact-dialog">
    <Dialog>
      <DialogTrigger as-child>
        <Button class="w-20">Add</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <form @submit="onSubmit">
          <DialogHeader>
            <DialogTitle>Add Impact</DialogTitle>
          </DialogHeader>
          <FormField v-slot="{ componentField }" name="category">
            <FormItem class="mt-2">
              <FormLabel>Category *</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="(impact, key) in fullImpactList">
                      <SelectItem :value="key">
                        <SelectLabel class="pl-0">{{ key }}</SelectLabel>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="mt-2">
              <FormLabel>Impact *</FormLabel>
              <FormControl>
                <Input
                  v-if="form.values.category === 'other'"
                  :disabled="!form.values.category"
                  v-bind="componentField"
                />
                <Select
                  v-else
                  :disabled="!form.values.category"
                  v-bind="componentField"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup
                      v-for="impact in IMPACTS[
                        form.values.category as keyof typeof IMPACTS
                      ]"
                    >
                      <SelectItem :value="impact">
                        <SelectLabel class="pl-0">{{ impact }}</SelectLabel>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem class="mt-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  :disabled="!form.values.category || !form.values.name"
                  placeholder="Optional"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <DialogFooter class="mt-2">
            <DialogClose>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

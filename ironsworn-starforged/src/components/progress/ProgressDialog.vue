<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { tasksStore, type TaskCategory } from '@/system/tasks/store'
import { DIFFICULTIES } from '@/system/tasks/types'
import { inject, watch } from 'vue'

const categories: TaskCategory[] =
  (inject('categories') as TaskCategory[]) ?? []

if (categories.length === 0) {
  throw new Error('Categories must have at least one element')
}

const formSchema = toTypedSchema(
  z.object({
    description: z.string().min(1).max(50),
    category: z.string().default(categories[0]),
    difficulty: z.enum(DIFFICULTIES),
  })
)
const form = useForm({
  validationSchema: formSchema,
})
const taskStore = tasksStore.get().context.list

const onSubmit = form.handleSubmit(values => {
  taskStore.addTask(
    values.description,
    values.category as TaskCategory,
    values.difficulty
  )
})
</script>

<template>
  <div class="progress-dialog">
    <Dialog>
      <DialogTrigger as-child>
        <Button
          variant="outline"
          class="border-primary h-8 w-24 border-2 font-bold"
          @click="form.values.category = categories[0]"
          >Add</Button
        >
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <form @submit="onSubmit">
          <div>{{ form.values }}</div>
          <DialogHeader>
            <DialogTitle>Add progress tracker</DialogTitle>
          </DialogHeader>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem class="mt-2">
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="category">
            <FormItem class="mt-2">
              <FormLabel>Type *</FormLabel>
              <FormControl>
                <Select
                  :disabled="!form.values.description"
                  v-bind="componentField"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="category in categories">
                      <SelectItem :value="category">
                        <SelectLabel class="pl-0">{{ category }}</SelectLabel>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="difficulty">
            <FormItem class="mt-2">
              <FormLabel>Difficulty *</FormLabel>
              <FormControl>
                <Select
                  :disabled="!form.values.description"
                  v-bind="componentField"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="difficulty in DIFFICULTIES">
                      <SelectItem :value="difficulty">
                        <SelectLabel class="pl-0">{{ difficulty }}</SelectLabel>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

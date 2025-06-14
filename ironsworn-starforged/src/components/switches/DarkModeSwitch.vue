<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

let mode = useColorMode();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child class="ml-1">
      <Button variant="outline">
        <Icon
          icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <Icon
          icon="radix-icons:sun"
          class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

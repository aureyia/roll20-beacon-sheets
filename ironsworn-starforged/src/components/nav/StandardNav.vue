<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { isSimEnvironment } from '@/main';

const baseList = {
  legacies: '/legacies',
  progress: '/progress',
  vows: '/vows',
  summary: '/summary',
  moves: '/moves',
  assets: '/assets',
  connections: '/connections',
};

const simList = {
  ...baseList,
  simulation: '/simulation',
};

const navList = isSimEnvironment ? simList : baseList;
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList class="flex gap-10">
      <NavigationMenuItem
        v-for="(item, key) in navList"
        :key="key"
        class="nav-item height-full cursor-pointer rounded font-normal"
        :class="$route.path === item ? 'underline' : ''"
      >
        <NavigationMenuLink @click="() => $router.push({ path: item })">
          {{ key }}</NavigationMenuLink
        >
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

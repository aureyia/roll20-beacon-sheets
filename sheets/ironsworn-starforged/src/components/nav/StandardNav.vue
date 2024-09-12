<script setup lang="ts">
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'

const navList = {
  legacies: '/legacies',
  progress: '/progress',
  vows: '/vows',
  summary: '/summary',
  moves: '/moves',
  assets: '/assets',
  connections: '/connections'
}
</script>

<template>
  <NavigationMenu class="ml-11">
    <NavigationMenuList class="flex gap-3">
      <NavigationMenuItem 
        v-for="(item, key) in navList" 
        :key="key" 
        class="rounded nav-item height-full cursor-pointer px-2 py-1 hover:bg-muted-accent"
      >
        <NavigationMenuLink @click="() => $router.push({ path: item})"> {{ key }}</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
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

// v-for="item in Object.keys(navList)

</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem v-for="(item, key) in navList" :key="key" class="nav-item m-2">
        <NavigationMenuLink @click="() => $router.push({ path: item})"> {{ key }}</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

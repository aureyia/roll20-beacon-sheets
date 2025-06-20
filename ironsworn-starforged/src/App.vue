<script setup lang="ts">
import { useRouter } from 'vue-router'
import { store_settings } from '@/system/settings.store'
const router = useRouter()

const mode = store_settings.select(context => context.mode)

mode.subscribe(value => {
    router.push({ name: value ?? 'mode-select' })
})
</script>

<template>
  <div class="starforged mt-20">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import CharHeader from '@/components/header/CharHeader.vue';
import { useRouter } from 'vue-router';
const router = useRouter()

router.push({ path: '/summary' })
</script>

<template>
  <CharHeader />
  <div class="main">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <div class="footer fixed bottom-0 left-0 right-0 py-2 text-center bg-slate-700 width-full">
    Nom
  </div>
</template>
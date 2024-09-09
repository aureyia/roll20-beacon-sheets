<script setup lang="ts">
import CharHeader from '@/components/header/CharHeader.vue';
import CharFooter from '@/components/footer/CharFooter.vue';
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
  <CharFooter />
</template>
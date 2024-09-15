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
      <Transition name="fade">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
  <CharFooter />
</template>

<style lang="sass" scoped>
.fade-enter-active
  transition: opacity 0.7s ease
  height: 0

.fade-leave-active
  height: 0

.fade-leave-to,
.fade-enter-from
  opacity: 0
  height: 0

</style>
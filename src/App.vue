<template>
  <div id="mobile-app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const hiddenTabBarPaths = ['/login', '/register']
const showTabBar = computed(() => !hiddenTabBarPaths.includes(route.path))
</script>

<style scoped>
#mobile-app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
}
</style>

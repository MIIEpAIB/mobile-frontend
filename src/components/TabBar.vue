<template>
  <nav class="tabbar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tabbar-item"
      :class="{ active: isActive(tab.path) }"
    >
      <span class="tabbar-icon">{{ tab.icon }}</span>
      <span class="tabbar-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const tabs = [
  { path: '/home', icon: '🏠', label: '首页' },
  { path: '/ai', icon: '🔮', label: 'AI测算' },
  { path: '/mall', icon: '🛍️', label: '商城' },
  { path: '/blessing', icon: '🙏', label: '祈福' },
  { path: '/user', icon: '👤', label: '我的' },
]
const isActive = (path) => route.path.startsWith(path)
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-light);
  padding: 6px 0 calc(6px + var(--safe-bottom));
  z-index: 999;
  box-shadow: 0 -4px 16px rgba(139, 26, 26, 0.06);
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  color: var(--text-tertiary);
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
}

.tabbar-item.active {
  color: var(--color-primary);
}

.tabbar-item.active::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-gold));
  border-radius: 2px;
}

.tabbar-icon {
  font-size: 22px;
  line-height: 1;
}

.tabbar-label {
  font-size: 10px;
  font-weight: 500;
}
</style>

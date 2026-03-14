<template>
  <header class="navbar">
    <button v-if="showBack" class="navbar-back" @click="goBack">←</button>
    <h1 class="navbar-title">{{ title }}</h1>
    <div class="navbar-right"><slot name="right" /></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true }
})
const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--text-inverse);
  box-shadow: 0 2px 12px rgba(139, 26, 26, 0.3);
}

.navbar-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-inverse);
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.navbar-back:active {
  background: rgba(255,255,255,0.15);
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;
}

.navbar-right {
  width: 32px;
}
</style>

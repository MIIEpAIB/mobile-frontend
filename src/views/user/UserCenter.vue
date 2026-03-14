<template>
  <div class="page-container">
    <div class="user-header">
      <div class="user-avatar">{{ userStore.nickname?.charAt(0) || '游' }}</div>
      <div class="user-info">
        <h2>{{ userStore.isLoggedIn ? userStore.nickname : '未登录' }}</h2>
        <p v-if="userStore.isLoggedIn">欢迎回来</p>
        <router-link v-else to="/login" class="login-link">点击登录 →</router-link>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-group card">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="menu-item">
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
          <span class="menu-arrow">→</span>
        </router-link>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-group card">
        <router-link v-for="item in serviceItems" :key="item.path" :to="item.path" class="menu-item">
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
          <span class="menu-arrow">→</span>
        </router-link>
      </div>
    </div>

    <button v-if="userStore.isLoggedIn" class="btn-outline logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()
const menuItems = [
  { path: '/user/orders', icon: '📋', label: '我的订单' },
  { path: '/user/wallet', icon: '💰', label: '我的钱包' },
  { path: '/user/address', icon: '📍', label: '收货地址' },
  { path: '/user/profile', icon: '👤', label: '个人资料' },
  { path: '/user/records', icon: '📊', label: '我的记录' },
]
const serviceItems = [
  { path: '/mall/cart', icon: '🛒', label: '购物车' },
  { path: '/memorial/tomb', icon: '🕯️', label: '我的陵墓' },
  { path: '/culture', icon: '📚', label: '玄学文化' },
  { path: '/course', icon: '🎓', label: '在线课程' },
]
const handleLogout = () => { userStore.logout(); router.push('/login') }
</script>
<style scoped>
.user-header { background:linear-gradient(135deg,var(--color-primary-dark),var(--color-primary)); padding:32px 20px; display:flex; align-items:center; gap:16px; color:var(--text-inverse); }
.user-avatar { width:56px; height:56px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; border:2px solid var(--color-gold); }
.user-info h2 { font-size:20px; font-weight:700; }
.user-info p { font-size:13px; color:rgba(253,245,236,0.6); margin-top:2px; }
.login-link { color:var(--color-gold); font-size:14px; }
.menu-section { padding:0 16px; margin-top:12px; }
.menu-group { padding:0; margin:0 0 0 0; }
.menu-item { display:flex; align-items:center; gap:12px; padding:16px; border-bottom:1px solid var(--border-light); text-decoration:none; color:var(--text-primary); }
.menu-item:last-child { border-bottom:none; }
.menu-icon { font-size:20px; }
.menu-label { flex:1; font-size:15px; }
.menu-arrow { color:var(--text-tertiary); font-size:14px; }
.logout-btn { margin:24px 16px; }
</style>

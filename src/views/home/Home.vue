<template>
  <div class="home-page page-container">
    <!-- 顶部 Header -->
    <header class="home-header">
      <div class="header-top">
        <div class="header-logo">
          <span class="logo-sym">☯</span>
          <span class="logo-text">鲲鹏易道</span>
        </div>
        <router-link to="/user" class="header-avatar">👤</router-link>
      </div>
      <p class="header-slogan">智运乾坤 · 易道通达</p>
    </header>

    <!-- Banner 轮播 -->
    <div class="banner-wrapper">
      <div class="banner-card">
        <div class="banner-content">
          <h2>AI 玄学测算</h2>
          <p>八字命理 · 风水分析 · 抽签解梦</p>
          <router-link to="/ai" class="banner-btn">立即体验 →</router-link>
        </div>
        <div class="banner-icon">🔮</div>
      </div>
    </div>

    <!-- 功能入口九宫格 -->
    <div class="section-title">核心服务</div>
    <div class="grid-menu">
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="grid-item">
        <span class="grid-icon">{{ item.icon }}</span>
        <span class="grid-label">{{ item.label }}</span>
      </router-link>
    </div>

    <!-- 热门推荐 -->
    <div class="section-title">热门推荐</div>
    <div class="hot-cards">
      <div class="hot-card" v-for="(item, idx) in hotItems" :key="idx" @click="$router.push(item.path)">
        <div class="hot-card-icon">{{ item.icon }}</div>
        <div class="hot-card-info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <span class="hot-card-arrow">→</span>
      </div>
    </div>

    <!-- 每日运势 -->
    <div class="section-title">每日运势</div>
    <div class="fortune-card card">
      <div class="fortune-header">
        <span class="fortune-date">{{ todayStr }}</span>
        <span class="tag tag-gold">宜：求财 · 动土</span>
      </div>
      <p class="fortune-text">今日五行属火，宜积极进取，利于事业发展。东南方位财气旺盛，可适当安排商务活动。</p>
      <router-link to="/ai/bazi" class="fortune-link">查看详细运势 →</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
})

const menuItems = [
  { path: '/ai/lottery', icon: '🎋', label: '抽签' },
  { path: '/ai/bazi', icon: '📜', label: '八字' },
  { path: '/ai/char', icon: '✍️', label: '测字' },
  { path: '/ai/dream', icon: '🌙', label: '解梦' },
  { path: '/ai/fengshui', icon: '🧭', label: '风水' },
  { path: '/ai/naming', icon: '📛', label: '取名' },
  { path: '/ai/phone', icon: '📱', label: '号码' },
  { path: '/blessing', icon: '🙏', label: '祈福' },
  { path: '/memorial', icon: '🕯️', label: '祭祀' },
  { path: '/mall', icon: '🛍️', label: '商城' },
  { path: '/expert', icon: '🧙', label: '专家' },
  { path: '/culture', icon: '📚', label: '文化' },
]

const hotItems = [
  { path: '/ai/lottery', icon: '🎋', title: '观音灵签', desc: '每日一签，趋吉避凶' },
  { path: '/ai/bazi', icon: '📜', title: '八字算命', desc: '知命改运，洞察先机' },
  { path: '/mall', icon: '🛍️', title: '开光法器', desc: '大师开光，灵验护身' },
]
</script>

<style scoped>
.home-page { background: var(--bg-primary); }

.home-header {
  background: linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%);
  padding: 20px 20px 30px;
  color: var(--text-inverse);
  position: relative;
  overflow: hidden;
}

.home-header::after {
  content: '☰☷☳☴☵☶☱☲';
  position: absolute;
  bottom: 10px;
  right: -10px;
  font-size: 40px;
  color: rgba(212, 160, 23, 0.08);
  letter-spacing: 8px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-sym {
  font-size: 28px;
  color: var(--color-gold);
  text-shadow: 0 0 15px rgba(212, 160, 23, 0.5);
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 3px;
  color: var(--color-gold);
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-decoration: none;
}

.header-slogan {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(253, 245, 236, 0.6);
  letter-spacing: 3px;
}

/* Banner */
.banner-wrapper { padding: 0 16px; margin-top: -16px; position: relative; z-index: 1; }

.banner-card {
  background: linear-gradient(135deg, #2a0e0e 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(212, 160, 23, 0.2);
}

.banner-content h2 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--color-gold);
  margin-bottom: 6px;
}

.banner-content p {
  font-size: 13px;
  color: rgba(253, 245, 236, 0.6);
  margin-bottom: 14px;
}

.banner-btn {
  display: inline-block;
  padding: 8px 20px;
  background: var(--color-gold);
  color: #1A0A0A;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.banner-icon { font-size: 56px; opacity: 0.9; }

/* Grid Menu */
.grid-menu {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 0 16px 8px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  text-decoration: none;
  color: var(--text-primary);
}

.grid-item:active {
  background: var(--color-primary-soft);
  transform: scale(0.95);
}

.grid-icon {
  font-size: 32px;
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--color-primary-soft), rgba(212, 160, 23, 0.08));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); }

/* Hot Cards */
.hot-cards { padding: 0 16px; }

.hot-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s;
}

.hot-card:active { transform: scale(0.98); }

.hot-card-icon {
  font-size: 36px;
  width: 52px;
  height: 52px;
  background: var(--color-primary-soft);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hot-card-info { flex: 1; }
.hot-card-info h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.hot-card-info p { font-size: 12px; color: var(--text-tertiary); }

.hot-card-arrow { color: var(--text-tertiary); font-size: 18px; }

/* Fortune */
.fortune-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.fortune-date { font-family: var(--font-serif); font-size: 14px; font-weight: 600; color: var(--color-primary); }
.fortune-text { font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; }
.fortune-link { font-size: 13px; color: var(--color-primary); font-weight: 500; }
</style>

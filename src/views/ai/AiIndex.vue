<template>
  <div class="ai-index page-container">
    <header class="ai-header">
      <div class="ai-header-bg">
        <div class="ai-logo">🔮</div>
        <h1>AI 玄学测算</h1>
        <p>古法智慧与现代AI的完美融合</p>
      </div>
    </header>

    <div class="ai-grid">
      <router-link v-for="item in services" :key="item.path" :to="item.path" class="ai-card" :style="{ '--card-color': item.color }">
        <span class="ai-card-icon">{{ item.icon }}</span>
        <div class="ai-card-info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const services = [
  { path: '/ai/lottery', icon: '🎋', title: '抽签问卦', desc: '观音灵签·每日一签', color: '#C41E24' },
  { path: '/ai/bazi', icon: '📜', title: '八字算命', desc: '知命改运·洞察先机', color: '#8B1A1A' },
  { path: '/ai/char', icon: '✍️', title: '测字解惑', desc: '一字窥运·字含天机', color: '#D4443E' },
  { path: '/ai/dream', icon: '🌙', title: '周公解梦', desc: '解读梦境·预示吉凶', color: '#6B3A3A' },
  { path: '/ai/fengshui', icon: '🧭', title: '风水分析', desc: '堪舆布局·趋吉避凶', color: '#4A2020' },
  { path: '/ai/naming', icon: '📛', title: '起名改名', desc: '五行配名·助运开运', color: '#A67C00' },
  { path: '/ai/phone', icon: '📱', title: '号码吉凶', desc: '手机号码·测算能量', color: '#D4A017' },
  { path: '/ai/dream', icon: '🎬', title: '影视测算', desc: '趣味占卜·寓教于乐', color: '#8B6914' },
]
</script>

<style scoped>
.ai-header {
  background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary), #2a0e0e);
  padding: 40px 20px 50px;
  text-align: center;
  color: var(--text-inverse);
}

.ai-logo { font-size: 56px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(212, 160, 23, 0.4)); }
.ai-header h1 { font-family: var(--font-serif); font-size: 26px; color: var(--color-gold); letter-spacing: 4px; margin-bottom: 8px; }
.ai-header p { font-size: 14px; color: rgba(253,245,236,0.6); letter-spacing: 2px; }

.ai-grid {
  padding: 0 16px;
  margin-top: -24px;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ai-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 20px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.ai-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--card-color);
}

.ai-card:active { transform: scale(0.97); box-shadow: var(--shadow-md); }

.ai-card-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.ai-card-info h3 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.ai-card-info p { font-size: 12px; color: var(--text-tertiary); }
</style>

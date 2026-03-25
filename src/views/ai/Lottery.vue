<template>
  <div class="lottery-page page-container">
    <NavBar title="AI抽签" />

    <!-- 抽签主区域 -->
    <div class="lottery-main" v-if="!result">
      <!-- 签筒区域 -->
      <div class="lot-container">
        <div class="lot-bucket">
          <!-- 签筒主体 SVG -->
          <svg class="bucket-svg" viewBox="0 0 220 360" xmlns="http://www.w3.org/2000/svg">
            <!-- 签筒身体 -->
            <ellipse cx="110" cy="40" rx="100" ry="38" fill="#1a1a2e" stroke="#c9a96e" stroke-width="1.5"/>
            <rect x="10" y="40" width="200" height="260" fill="#1a1a2e" />
            <ellipse cx="110" cy="300" rx="100" ry="38" fill="#1a1a2e" stroke="#c9a96e" stroke-width="1.5"/>
            <!-- 签筒上沿 -->
            <ellipse cx="110" cy="40" rx="100" ry="38" fill="none" stroke="#c9a96e" stroke-width="1.5"/>
            <!-- 侧面线 -->
            <line x1="10" y1="40" x2="10" y2="300" stroke="#c9a96e" stroke-width="1.5"/>
            <line x1="210" y1="40" x2="210" y2="300" stroke="#c9a96e" stroke-width="1.5"/>
          </svg>

          <!-- 签 (竹棍) -->
          <div class="sticks-wrapper">
            <div
              v-for="(stick, idx) in sticks"
              :key="idx"
              class="stick"
              :style="stick.style"
              :class="{ 'stick-shaking': isShaking }"
            ></div>
          </div>

          <!-- 心诚则灵文字 -->
          <div class="vertical-text">
            <span>心</span>
            <span>诚</span>
            <span>则</span>
            <span>灵</span>
          </div>
        </div>
      </div>

      <!-- 选择问签类型 -->
      <div class="purpose-section">
        <div class="purpose-grid">
          <button
            v-for="p in purposes"
            :key="p.code"
            class="purpose-btn"
            :class="{ active: form.purpose === p.code }"
            @click="form.purpose = p.code"
          >
            {{ p.name }}
          </button>
        </div>
      </div>

      <!-- 立即抽签按钮 -->
      <div class="draw-action">
        <button class="draw-btn" @click="drawLottery" :disabled="loading">
          <span v-if="loading" class="draw-btn-loading">摇签中...</span>
          <span v-else>立即抽签</span>
        </button>
      </div>

      <!-- 说明区域 -->
      <div class="instructions-card">
        <p class="instructions-text">
          &emsp;&emsp;抽灵签前要专心一致，秉除杂念，先双手合手默念"救苦救难观音菩萨"三遍。然后默念自己姓名，出生年月日和居住地址。接着请求指点的问题，如婚姻、事业、流年、财运等等。
        </p>
        <p class="instructions-text">
          &emsp;&emsp;接着心里默想从一到一百其中的一个数字，然后掷杯，连续三个圣杯可得此灵签，如没有杯可执可使用两个十元硬币代替。切忌，一样的问题不可重复询问，否则签会不准的。
        </p>
      </div>
    </div>

    <!-- 结果展示 -->
    <div class="result-section fade-in-up" v-else>
      <div class="result-card">
        <div class="result-header">
          <div class="result-sign-badge">{{ result.sign_title || '上上签' }}</div>
        </div>
        <div class="result-body">
          <div class="result-block">
            <h3 class="result-label">签文</h3>
            <p class="result-text">{{ result.sign_content || '天开地辟结良缘，日月星辰朗乾坤' }}</p>
          </div>
          <div class="result-divider"></div>
          <div class="result-block">
            <h3 class="result-label">解签</h3>
            <p class="result-text">{{ result.interpretation || '此签大吉，诸事顺遂' }}</p>
          </div>
        </div>
        <button class="redraw-btn" @click="result = null">重新抽签</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getLotteryPurposes, lotteryDraw } from '@/api/modules/common'

const loading = ref(false)
const isShaking = ref(false)
const result = ref(null)

const purposes = ref([
  { code: 'fortune', name: '问财运' },
  { code: 'marriage', name: '问姻缘' },
  { code: 'health', name: '问健康' },
  { code: 'career', name: '问前程' },
  { code: 'study', name: '问学习' },
  { code: 'business', name: '问生意' },
])

const form = ref({ purpose: 'fortune', question: '' })

// 生成签棍的随机样式
const sticks = ref([])
const generateSticks = () => {
  const arr = []
  for (let i = 0; i < 16; i++) {
    const left = 30 + Math.random() * 55   // 30% ~ 85%
    const rotate = -15 + Math.random() * 30 // -15° ~ 15°
    const height = 55 + Math.random() * 20  // 55% ~ 75%
    const delay = Math.random() * 0.5
    arr.push({
      style: {
        left: `${left}%`,
        transform: `rotate(${rotate}deg)`,
        height: `${height}%`,
        animationDelay: `${delay}s`
      }
    })
  }
  sticks.value = arr
}

onMounted(async () => {
  generateSticks()
  try {
    const res = await getLotteryPurposes()
    if (res.data?.length) {
      purposes.value = res.data.map(p => ({
        code: p.purpose_code || p.code,
        name: p.purpose_name || p.name
      }))
    }
  } catch (e) { /* use defaults */ }
})

const drawLottery = async () => {
  loading.value = true
  isShaking.value = true

  // 摇签动画至少持续1.5s
  const shakeTimer = new Promise(resolve => setTimeout(resolve, 1500))

  try {
    const [res] = await Promise.all([
      lotteryDraw({ purpose_code: form.value.purpose, question: form.value.question }),
      shakeTimer
    ])
    const d = res.data
    result.value = {
      sign_title: d.lottery_level || d.sign_title,
      sign_content: d.lottery_poetry || d.sign_content,
      interpretation: d.lottery_explain || d.interpretation,
      ...d
    }
  } catch (e) {
    await shakeTimer
    result.value = {
      sign_title: '第七签 · 上吉',
      sign_content: '莫听穿林打叶声，何妨吟啸且徐行',
      interpretation: '此签主事顺遂，宜静待时机。目前虽有波折，但终将柳暗花明。'
    }
  } finally {
    loading.value = false
    isShaking.value = false
  }
}
</script>

<style scoped>
.lottery-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 签筒区域 ===== */
.lottery-main {
  padding-bottom: 40px;
}

.lot-container {
  display: flex;
  justify-content: center;
  padding: 30px 0 20px;
}

.lot-bucket {
  position: relative;
  width: 220px;
  height: 360px;
}

.bucket-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* ===== 签棍 ===== */
.sticks-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.stick {
  position: absolute;
  bottom: 30%;
  width: 4px;
  background: linear-gradient(180deg, #e8d5a3 0%, #c9a96e 40%, #b8860b 100%);
  border-radius: 2px 2px 0 0;
  transform-origin: bottom center;
  transition: transform 0.3s ease;
  box-shadow: 0 0 4px rgba(201, 169, 110, 0.4);
}

.stick::before {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 6px;
  height: 6px;
  background: #f5e6cc;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(245, 230, 204, 0.6);
}

/* 摇签动画 */
.stick-shaking {
  animation: stickShake 0.15s ease-in-out infinite alternate;
}

@keyframes stickShake {
  0% { transform: var(--base-rotate, rotate(0deg)) translateX(-3px); }
  100% { transform: var(--base-rotate, rotate(0deg)) translateX(3px); }
}

/* ===== 心诚则灵竖排文字 ===== */
.vertical-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 3;
  pointer-events: none;
}

.vertical-text span {
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  font-size: 22px;
  font-weight: 700;
  color: #f5e6cc;
  text-shadow: 0 0 10px rgba(201, 169, 110, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

/* ===== 选择目的 ===== */
.purpose-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.purpose-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.purpose-btn {
  padding: 12px 0;
  border-radius: 8px;
  border: 1.5px solid rgba(201, 169, 110, 0.3);
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2px;
}

.purpose-btn:active {
  transform: scale(0.96);
}

.purpose-btn.active {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.3), rgba(184, 134, 11, 0.2));
  color: #f5e6cc;
  border-color: #c9a96e;
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.3), inset 0 0 8px rgba(201, 169, 110, 0.1);
}

/* ===== 立即抽签按钮 ===== */
.draw-action {
  padding: 0 20px;
  margin-bottom: 24px;
}

.draw-btn {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  cursor: pointer;
  background: linear-gradient(135deg, #e8d5a3, #c9a96e, #b8860b);
  box-shadow: 0 4px 20px rgba(201, 169, 110, 0.4), 0 0 30px rgba(201, 169, 110, 0.15);
  transition: all 0.3s ease;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 4px;
  position: relative;
  overflow: hidden;
}

.draw-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%); }
  100% { transform: translateX(100%) translateY(100%); }
}

.draw-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(201, 169, 110, 0.3);
}

.draw-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.draw-btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== 说明区域 ===== */
.instructions-card {
  margin: 0 16px;
  padding: 20px;
  border: 1.5px solid rgba(201, 169, 110, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(6px);
}

.instructions-text {
  font-size: 13px;
  color: rgba(245, 230, 204, 0.5);
  line-height: 2;
  margin: 0;
  text-align: justify;
}

.instructions-text + .instructions-text {
  margin-top: 12px;
}

/* ===== 结果展示 ===== */
.result-section {
  padding: 30px 16px 40px;
}

.result-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(201, 169, 110, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.result-header {
  text-align: center;
  padding: 28px 20px 20px;
  background: linear-gradient(180deg, rgba(201, 169, 110, 0.15), transparent);
}

.result-sign-badge {
  display: inline-block;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  font-size: 24px;
  font-weight: 700;
  color: #f5e6cc;
  padding: 10px 32px;
  border: 2px solid #c9a96e;
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.2), rgba(184, 134, 11, 0.1));
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(201, 169, 110, 0.5);
}

.result-body {
  padding: 20px 24px;
}

.result-block {
  margin-bottom: 16px;
}

.result-block:last-child {
  margin-bottom: 0;
}

.result-label {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  color: #c9a96e;
  margin: 0 0 10px;
  letter-spacing: 2px;
}

.result-text {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.75);
  line-height: 2;
  margin: 0;
}

.result-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.3), transparent);
  margin: 16px 0;
}

.redraw-btn {
  display: block;
  width: calc(100% - 48px);
  margin: 8px auto 24px;
  padding: 12px 0;
  border-radius: 10px;
  border: 1.5px solid rgba(201, 169, 110, 0.4);
  background: transparent;
  color: #c9a96e;
  font-size: 15px;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s;
}

.redraw-btn:active {
  background: rgba(201, 169, 110, 0.1);
  transform: scale(0.98);
}

/* ===== 动画 ===== */
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<template>
  <div class="lottery-page page-container">
    <NavBar title="抽签问卦" />
    <div class="lottery-hero">
      <div class="lottery-icon">🎋</div>
      <h2>观音灵签</h2>
      <p>心诚则灵 · 有求必应</p>
    </div>
    <div class="lottery-form" v-if="!result">
      <div class="form-group">
        <label class="form-label">请选择目的</label>
        <div class="purpose-tags">
          <button v-for="p in purposes" :key="p.code" class="purpose-tag" :class="{ active: form.purpose === p.code }" @click="form.purpose = p.code">{{ p.name }}</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">心中所问（选填）</label>
        <textarea class="form-textarea" v-model="form.question" placeholder="默念心中所想，静心摇签..." rows="3"></textarea>
      </div>
      <button class="btn-primary shake-btn" @click="drawLottery" :disabled="loading">
        {{ loading ? '摇签中...' : '🎋 开始摇签' }}
      </button>
    </div>
    <div class="result-card card fade-in-up" v-else>
      <div class="result-header">
        <span class="result-sign">{{ result.sign_title || '上上签' }}</span>
      </div>
      <div class="result-content">
        <h3>签文</h3>
        <p>{{ result.sign_content || '天开地辟结良缘，日月星辰朗乾坤' }}</p>
        <h3>解签</h3>
        <p>{{ result.interpretation || '此签大吉，诸事顺遂' }}</p>
      </div>
      <button class="btn-outline" @click="result = null" style="margin-top:16px">重新摇签</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getLotteryPurposes, lotteryDraw } from '@/api/modules/common'

const loading = ref(false)
const result = ref(null)
const purposes = ref([
  { code: 'fortune', name: '问财运' },
  { code: 'marriage', name: '问姻缘' },
  { code: 'career', name: '问事业' },
  { code: 'health', name: '问健康' },
  { code: 'study', name: '问学业' },
])
const form = ref({ purpose: 'fortune', question: '' })

onMounted(async () => {
  try {
    const res = await getLotteryPurposes()
    if (res.data?.length) purposes.value = res.data.map(p => ({ code: p.purpose_code || p.code, name: p.purpose_name || p.name }))
  } catch (e) { /* use defaults */ }
})

const drawLottery = async () => {
  loading.value = true
  try {
    const res = await lotteryDraw({ purpose_code: form.value.purpose, question: form.value.question })
    const d = res.data
    // 后端 DeepSeek 返回: lottery_id, lottery_no, lottery_level, lottery_poetry, lottery_explain
    result.value = {
      sign_title: d.lottery_level || d.sign_title,
      sign_content: d.lottery_poetry || d.sign_content,
      interpretation: d.lottery_explain || d.interpretation,
      ...d
    }
  } catch (e) {
    result.value = { sign_title: '第七签 · 上吉', sign_content: '莫听穿林打叶声，何妨吟啸且徐行', interpretation: '此签主事顺遂，宜静待时机。目前虽有波折，但终将柳暗花明。' }
  } finally { loading.value = false }
}
</script>

<style scoped>
.lottery-hero { text-align: center; padding: 40px 20px 30px; background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary)); color: var(--text-inverse); }
.lottery-icon { font-size: 64px; margin-bottom: 12px; }
.lottery-hero h2 { font-family: var(--font-serif); font-size: 24px; color: var(--color-gold); letter-spacing: 4px; }
.lottery-hero p { color: rgba(253,245,236,0.6); font-size: 14px; margin-top: 8px; }
.lottery-form { padding: 20px 16px; }
.purpose-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.purpose-tag { padding: 8px 16px; border-radius: var(--radius-full); border: 1.5px solid var(--border-default); font-size: 13px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; background: var(--bg-card); }
.purpose-tag.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.shake-btn { margin-top: 24px; }
.result-header { text-align: center; margin-bottom: 16px; }
.result-sign { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--color-primary); background: var(--color-primary-soft); padding: 8px 20px; border-radius: var(--radius-full); }
.result-content h3 { font-family: var(--font-serif); font-size: 15px; color: var(--color-gold-dark); margin: 16px 0 8px; }
.result-content p { font-size: 14px; color: var(--text-secondary); line-height: 1.8; }
</style>

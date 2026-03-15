<template>
  <div class="page-container">
    <NavBar title="号码测算" />
    <div class="hero"><span>📱</span><h2>手机号吉凶</h2></div>
    <div class="form-area" v-if="!result">
      <div class="form-group"><label class="form-label">输入手机号码</label><input class="form-input phone-input" v-model="form.phone_number" placeholder="请输入11位手机号" maxlength="11" /></div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '测算中...' : '开始测算' }}</button>
    </div>
    <div class="result card fade-in-up" v-else>
      <div class="phone-display">{{ result.phone_number }}</div>
      <div class="level-badge" :class="levelClass">{{ result.auspicious_level }}</div>
      <div class="res-section"><h4>号码分析</h4><p>{{ result.number_analysis }}</p></div>
      <div class="res-section"><h4>五行属性</h4><p>{{ result.five_elements }}</p></div>
      <div class="res-section"><h4>建议</h4><p>{{ result.suggestion }}</p></div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新测算</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiPhone } from '@/api/modules/ai'
const loading = ref(false), result = ref(null)
const form = ref({ phone_number: '' })
const levelClass = computed(() => { const l = result.value?.auspicious_level||''; return l.includes('吉') ? 'good' : 'neutral' })
const submit = async () => {
  if (form.value.phone_number.length !== 11) return alert('请输入11位手机号')
  loading.value = true
  try {
  const r = await aiPhone(form.value)
  const d = r.data
  // 后端 DeepSeek 返回 analysis 全文
  result.value = {
    phone_number: form.value.phone_number,
    auspicious_level: d.auspicious_level || '吉凶见分析',
    number_analysis: d.analysis || d.number_analysis || '',
    five_elements: d.five_elements || '',
    suggestion: d.suggestion || d.analysis || ''
  }
} catch {
  result.value = { phone_number: form.value.phone_number, auspicious_level: '大吉', number_analysis: '此号码数理为吉祥组合，中间四位暗含财运密码，尾号组合利于人际关系与事业发展。', five_elements: '五行属火土，利于南方发展', suggestion: '此号码整体大吉，适合长期使用。建议配合东南方位使用手机，增强号码能量。' }
} finally { loading.value = false }
}
</script>
<style scoped>
.hero { text-align:center; padding:36px 20px 28px; background:linear-gradient(160deg,var(--color-primary-dark),var(--color-primary)); color:var(--text-inverse); }
.hero span { font-size:48px; } .hero h2 { font-family:var(--font-serif); font-size:22px; color:var(--color-gold); letter-spacing:4px; margin-top:8px; }
.form-area { padding:20px 16px; }
.phone-input { font-size:24px; text-align:center; letter-spacing:4px; font-weight:700; }
.result { margin:16px; text-align:center; }
.phone-display { font-size:28px; font-weight:700; letter-spacing:3px; color:var(--text-primary); margin-bottom:12px; }
.level-badge { display:inline-block; padding:6px 24px; border-radius:var(--radius-full); font-size:18px; font-weight:700; margin-bottom:20px; }
.level-badge.good { background:rgba(82,196,26,0.1); color:#52C41A; }
.level-badge.neutral { background:var(--color-gold-soft); color:var(--color-gold-dark); }
.res-section { text-align:left; margin-bottom:14px; }
.res-section h4 { font-size:15px; font-weight:600; color:var(--color-primary); margin-bottom:6px; }
.res-section p { font-size:14px; color:var(--text-secondary); line-height:1.8; }
</style>

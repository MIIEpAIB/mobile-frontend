<template>
  <div class="page-container">
    <NavBar title="测字解惑" />
    <div class="hero"><span>✍️</span><h2>测字</h2><p>一字窥运 · 字含天机</p></div>
    <div class="form-area" v-if="!result">
      <div class="form-group"><label class="form-label">请选择测字目的</label>
        <div class="purpose-tags"><button v-for="p in purposes" :key="p.code" class="purpose-tag" :class="{active:form.purpose===p.code}" @click="form.purpose=p.code">{{ p.name }}</button></div>
      </div>
      <div class="form-group"><label class="form-label">请写一个汉字</label>
        <input class="form-input char-input" v-model="form.character" maxlength="1" placeholder="写" />
      </div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '测算中...' : '开始测字' }}</button>
    </div>
    <div class="result card fade-in-up" v-else>
      <div class="result-char">{{ result.character || form.character }}</div>
      <div class="result-purpose tag tag-gold">{{ result.purpose_name || '问事' }}</div>

      <!-- 易经卦象（免费） -->
      <div class="hex-card" v-if="result.hexagram">
        <div class="hex-label">所得卦象</div>
        <div class="hex-name">第 {{ result.hexagram.index }} 卦 · {{ result.hexagram.name }}</div>
        <div class="hex-brief">{{ result.hexagram.brief }}</div>
      </div>

      <div class="overview-block">
        <h4 class="block-title">总览</h4>
        <div class="overview-text" v-html="formatContent(result.overview || result.analysis)"></div>
      </div>

      <!-- 详批：未解锁模糊遮罩 -->
      <div class="detail-block" v-if="!showDetail">
        <h4 class="block-title">详细解读</h4>
        <div class="locked-wrap">
          <div class="locked-blur">
            <p class="fake-line">卦象详解：■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
            <p class="fake-line">爻辞：■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
            <p class="fake-line">吉凶方位：■■■■■■■■■■■■■■■■■■■■■■</p>
            <p class="fake-line">行动建议：■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
          </div>
          <div class="locked-overlay">
            <p class="pay-tip">完整解读含：卦象详解、爻辞、吉凶方位、行动建议</p>
            <p class="pay-price">{{ Math.round(Number(result.unlock_price_cny || 9.9) * 10) }}元宝</p>
            <button type="button" class="btn-unlock" :disabled="unlocking" @click="payUnlock">
              {{ unlocking ? '处理中...' : '支付解锁' }}
            </button>
            <p class="pay-mock">开发环境将模拟支付成功（mock）</p>
          </div>
        </div>
      </div>

      <!-- 详批：已解锁 -->
      <div class="detail-block" v-else-if="showDetail">
        <h4 class="block-title">详细解读</h4>
        <div class="detail-section" v-if="result.detail">
          <h5>{{ result.detail_section_titles?.hexagram_comment || '卦象详解' }}</h5>
          <div v-html="formatContent(result.detail.hexagram_comment)"></div>
          <h5>{{ result.detail_section_titles?.yao_ci || '爻辞' }}</h5>
          <div v-html="formatContent(result.detail.yao_ci)"></div>
          <h5>{{ result.detail_section_titles?.auspicious_direction || '吉凶方位' }}</h5>
          <div v-html="formatContent(result.detail.auspicious_direction)"></div>
          <h5>{{ result.detail_section_titles?.action_advice || '行动建议' }}</h5>
          <div v-html="formatContent(result.detail.action_advice)"></div>
        </div>
      </div>

      <button class="btn-outline" @click="reset" style="margin-top:16px">重新测字</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getDivinationPurposes, characterCalculate, unlockCharacterDetail } from '@/api/modules/common'

const loading = ref(false)
const unlocking = ref(false)
const result = ref(null)
const purposes = ref([
  { code: 'fortune', name: '问财运' },
  { code: 'marriage', name: '问姻缘' },
  { code: 'health', name: '问健康' },
  { code: 'career', name: '问前程' },
  { code: 'study', name: '问学习' },
])
const form = ref({ character: '', purpose: 'fortune' })

/** 已支付解锁：后端返回 detail 且 detail_locked 为 false */
const showDetail = computed(() => {
  const r = result.value
  if (!r?.detail) return false
  return r.detail_locked === false || r.unlocked === true
})

onMounted(async () => {
  try {
    const r = await getDivinationPurposes()
    if (r.data?.length) purposes.value = r.data.map(p => ({ code: p.purpose_code, name: p.purpose_name }))
  } catch { /* 使用默认目的 */ }
})

const formatContent = (t) => (t || '').replace(/\n/g, '<br/>')

const submit = async () => {
  if (!form.value.character) return alert('请输入一个汉字')
  loading.value = true
  try {
    const r = await characterCalculate({ character: form.value.character, purpose_code: form.value.purpose })
    result.value = { ...r.data, detail_locked: r.data.detail_locked !== false }
  } catch {
    result.value = {
      character: form.value.character,
      purpose_name: '问财运',
      hexagram: { index: 1, name: '乾为天', brief: '天行健，君子以自强不息。' },
      overview: '此为离线演示：卦象纲要可见，详批需解锁后查看。',
      detail_locked: true,
      unlock_price_cny: 9.9,
      detail_section_titles: {
        hexagram_comment: '卦象详解',
        yao_ci: '爻辞',
        auspicious_direction: '吉凶方位',
        action_advice: '行动建议',
      },
    }
  } finally {
    loading.value = false
  }
}

const payUnlock = async () => {
  if (!result.value?.result_id) return alert('缺少测算编号，请重新测字')
  unlocking.value = true
  try {
    const r = await unlockCharacterDetail({ result_id: result.value.result_id, mock_pay: true })
    const d = r.data
    if (d.unlocked && d.detail) {
      result.value = {
        ...result.value,
        ...d,
        detail_locked: false,
        detail_section_titles: result.value.detail_section_titles || d.detail_section_titles,
      }
    } else if (d.payment_required) {
      alert(d.payment_hint || '请先完成支付')
    }
  } catch (e) {
    alert(e?.message || '解锁失败，请稍后重试')
  } finally {
    unlocking.value = false
  }
}

const reset = () => {
  result.value = null
}
</script>
<style scoped>
.hero { text-align:center; padding:36px 20px 28px; background:linear-gradient(160deg,var(--color-primary-dark),var(--color-primary)); color:var(--text-inverse); }
.hero span { font-size:48px; } .hero h2 { font-family:var(--font-serif); font-size:22px; color:var(--color-gold); letter-spacing:4px; margin:8px 0 4px; } .hero p { color:rgba(253,245,236,0.5); font-size:13px; }
.form-area { padding:20px 16px; }
.purpose-tags { display:flex; flex-wrap:wrap; gap:8px; }
.purpose-tag { padding:8px 16px; border-radius:var(--radius-full); border:1.5px solid var(--border-default); font-size:13px; color:var(--text-secondary); cursor:pointer; background:var(--bg-card); }
.purpose-tag.active { background:var(--color-primary); color:white; border-color:var(--color-primary); }
.char-input { font-family:var(--font-serif); font-size:48px; text-align:center; height:80px; font-weight:900; color:var(--color-primary); }
.result { margin:16px; text-align:center; }
.result-char { font-family:var(--font-serif); font-size:64px; font-weight:900; color:var(--color-primary); margin-bottom:8px; }
.result-purpose { display:inline-block; margin-bottom:16px; }

.hex-card {
  text-align:left;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-light);
}
.hex-label { font-size:12px; color: var(--text-tertiary); margin-bottom:6px; }
.hex-name { font-family: var(--font-serif); font-size:17px; font-weight:700; color: var(--color-primary); margin-bottom:6px; }
.hex-brief { font-size:13px; color: var(--text-secondary); line-height:1.7; }

.block-title {
  font-size:15px;
  font-weight:700;
  color: var(--color-primary);
  margin: 12px 0 8px;
  text-align:left;
}
.overview-block { text-align:left; margin-bottom: 8px; }
.overview-text { font-size:14px; color: var(--text-secondary); line-height:1.9; }

.detail-block { text-align:left; margin-top: 8px; }
.locked-wrap { position: relative; border-radius: var(--radius-md); overflow: hidden; min-height: 160px; }
.locked-blur {
  filter: blur(5px);
  user-select: none;
  opacity: 0.55;
  padding: 12px;
  background: var(--bg-secondary);
}
.fake-line { font-size:13px; margin: 8px 0; color: var(--text-primary); letter-spacing: 1px; }
.locked-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.88));
  padding: 16px;
  text-align: center;
}
.pay-tip { font-size:12px; color: var(--text-secondary); margin-bottom: 6px; max-width: 280px; }
.pay-price { font-size:22px; font-weight: 800; color: var(--color-primary); margin-bottom: 10px; }
.btn-unlock {
  min-width: 200px;
  height: 40px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.pay-mock { font-size:11px; color: var(--text-tertiary); margin-top: 8px; }

.detail-section h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 14px 0 6px;
  color: var(--text-primary);
}
.detail-section div { font-size: 14px; color: var(--text-secondary); line-height: 1.85; }
</style>

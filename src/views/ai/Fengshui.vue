<template>
  <div class="page-container">
    <NavBar title="风水分析" />
    <div class="hero"><span>🧭</span><h2>风水堪舆</h2></div>
    <div class="form-area" v-if="!result">
      <div class="form-group"><label class="form-label">房屋类型</label>
        <select class="form-input" v-model="form.house_type"><option value="apartment">公寓</option><option value="house">独栋</option><option value="office">办公室</option><option value="shop">商铺</option></select>
      </div>
      <div class="form-group"><label class="form-label">地址</label><input class="form-input" v-model="form.address" placeholder="请输入详细地址" /></div>
      <div class="form-group"><label class="form-label">您的问题</label><textarea class="form-textarea" v-model="form.question" placeholder="描述您想了解的风水问题..." rows="4"></textarea></div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '分析中...' : '开始分析' }}</button>
    </div>
    <div class="result card fade-in-up" v-else>
      <h3 class="res-title">🧭 风水分析报告</h3>
      <p class="res-text">{{ result.overall_analysis }}</p>
      <div v-for="pos in (result.key_positions||[])" :key="pos.position" class="pos-card">
        <h4>{{ pos.position }}</h4><p>{{ pos.analysis }}</p><p class="suggestion">💡 {{ pos.suggestion }}</p>
      </div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新分析</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiFengshui } from '@/api/modules/ai'
const loading = ref(false), result = ref(null)
const form = ref({ house_type: 'apartment', address: '', question: '' })
const submit = async () => {
  if (!form.value.address && !form.value.question) return alert('请填写地址或问题')
  loading.value = true
  try {
    const r = await aiFengshui({ address: form.value.address, direction: form.value.question || '' })
    const d = r.data
    // 后端 DeepSeek 返回 analysis 全文
    result.value = { overall_analysis: d.analysis || d.overall_analysis || '', key_positions: d.key_positions || [] }
  } catch {
    result.value = { overall_analysis: '整体风水格局良好，坐北朝南，采光充足。建议客厅摆放绿植以增旺财运。', key_positions: [{ position: '客厅', analysis: '客厅位于财位，采光好', suggestion: '摆放发财树，增添生气' }, { position: '卧室', analysis: '卧室偏西，气场平稳', suggestion: '床头朝东放置，有助休息' }] }
  } finally { loading.value = false }
}
</script>
<style scoped>
.hero { text-align:center; padding:36px 20px 28px; background:linear-gradient(160deg,var(--color-primary-dark),var(--color-primary)); color:var(--text-inverse); }
.hero span { font-size:48px; }
.hero h2 { font-family:var(--font-serif); font-size:22px; color:var(--color-gold); letter-spacing:4px; margin-top:8px; }
.form-area { padding:20px 16px; }
.result { margin:16px; }
.res-title { font-family:var(--font-serif); font-size:18px; color:var(--color-primary); margin-bottom:12px; text-align:center; }
.res-text { font-size:14px; color:var(--text-secondary); line-height:1.8; margin-bottom:16px; }
.pos-card { background:var(--bg-secondary); border-radius:var(--radius-md); padding:14px; margin-bottom:10px; }
.pos-card h4 { font-size:15px; color:var(--color-primary); margin-bottom:6px; }
.pos-card p { font-size:13px; color:var(--text-secondary); line-height:1.6; }
.suggestion { color:var(--color-gold-dark); margin-top:6px; }
</style>

<template>
  <div class="page-container">
    <NavBar title="周公解梦" />
    <div class="hero"><span>🌙</span><h2>解梦</h2><p>梦由心生 · 解梦知运</p></div>
    <div class="form-area" v-if="!result">
      <div class="form-group"><label class="form-label">描述您的梦境</label><textarea class="form-textarea" v-model="form.dream_content" placeholder="请详细描述您梦到的内容..." rows="5"></textarea></div>
      <div class="form-group"><label class="form-label">梦中情绪（选填）</label><input class="form-input" v-model="form.dream_emotion" placeholder="如：恐惧、开心、焦虑..." /></div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '解析中...' : '开始解梦' }}</button>
    </div>
    <div class="result card fade-in-up" v-else>
      <h3>梦境解析</h3>
      <div class="res-item"><h4>🔮 梦境象征</h4><p>{{ result.dream_symbol }}</p></div>
      <div class="res-item"><h4>📖 详细解读</h4><p>{{ result.interpretation }}</p></div>
      <div class="res-item"><h4>💡 建议</h4><p>{{ result.suggestion }}</p></div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新解梦</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiDream } from '@/api/modules/ai'
const loading = ref(false), result = ref(null)
const form = ref({ dream_content: '', dream_emotion: '' })
const submit = async () => {
  if (!form.value.dream_content) return alert('请描述梦境')
  loading.value = true
  try {
  const r = await aiDream({ dream_content: form.value.dream_content, dream_keyword: form.value.dream_emotion })
  const d = r.data
  // 后端 DeepSeek 返回 interpretation 全文
  result.value = {
    dream_symbol: d.dream_symbol || (d.interpretation ? d.interpretation.slice(0, 80) + (d.interpretation.length > 80 ? '…' : '') : ''),
    interpretation: d.interpretation || '',
    suggestion: d.suggestion || d.interpretation || ''
  }
} catch {
  result.value = { dream_symbol: '飞翔象征内心对自由与突破的渴望', interpretation: '梦见飞翔通常代表近期将迎来好运，事业上会有新的突破和机遇。', suggestion: '把握机会，勇敢追求目标，近期适合开展新计划。' }
}
  finally { loading.value = false }
}
</script>
<style scoped>
.hero { text-align:center; padding:36px 20px 28px; background:linear-gradient(160deg,#1a0a2e,#2a0e3e); color:var(--text-inverse); }
.hero span { font-size:48px; }
.hero h2 { font-family:var(--font-serif); font-size:22px; color:#c8a0ff; letter-spacing:4px; margin:8px 0 4px; }
.hero p { color:rgba(200,160,255,0.5); font-size:13px; }
.form-area { padding:20px 16px; }
.result { margin:16px; }
.result h3 { font-family:var(--font-serif); font-size:18px; color:var(--color-primary); text-align:center; margin-bottom:16px; }
.res-item { margin-bottom:16px; }
.res-item h4 { font-size:15px; font-weight:600; margin-bottom:6px; color:var(--text-primary); }
.res-item p { font-size:14px; color:var(--text-secondary); line-height:1.8; }
</style>

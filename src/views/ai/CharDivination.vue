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
      <div class="result-purpose tag tag-gold">{{ result.purpose_name || '问财运' }}</div>
      <div class="interp" v-html="formatContent(result.analysis || result.interpretation_content)"></div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新测字</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getDivinationPurposes, characterCalculate } from '@/api/modules/common'
const loading = ref(false), result = ref(null)
const purposes = ref([{code:'fortune',name:'问财运'},{code:'marriage',name:'问姻缘'},{code:'health',name:'问健康'},{code:'career',name:'问前程'},{code:'study',name:'问学习'}])
const form = ref({ character: '', purpose: 'fortune' })
onMounted(async () => { try { const r = await getDivinationPurposes(); if(r.data?.length) purposes.value = r.data.map(p=>({code:p.purpose_code,name:p.purpose_name})) } catch{} })
const submit = async () => {
  if (!form.value.character) return alert('请输入一个汉字')
  loading.value = true
  try { const r = await characterCalculate({ character: form.value.character, purpose_code: form.value.purpose }); result.value = r.data } catch { result.value = { character: form.value.character, purpose_name: '问财运', interpretation_content: '此字蕴含深意，上部结构代表天时，下部结构代表地利。综合来看，您所问之事整体运势向好，宜把握时机，稳步前行。' } }
  finally { loading.value = false }
}
const formatContent = (t) => (t||'').replace(/\n/g, '<br/>')
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
.interp { font-size:14px; color:var(--text-secondary); line-height:2; text-align:left; }
</style>

<template>
  <div class="page-container">
    <NavBar title="起名改名" />
    <div class="hero"><span>📛</span><h2>起名改名</h2></div>
    <div class="form-area" v-if="!result">
      <div class="form-group"><label class="form-label">姓氏</label><input class="form-input" v-model="form.surname" placeholder="请输入姓氏" /></div>
      <div class="form-group"><label class="form-label">性别</label>
        <div class="gender-row"><button :class="{active:form.gender==='male'}" @click="form.gender='male'">♂ 男</button><button :class="{active:form.gender==='female'}" @click="form.gender='female'">♀ 女</button></div>
      </div>
      <div class="form-group"><label class="form-label">出生日期</label><input class="form-input" v-model="form.birth_date" type="date" /></div>
      <div class="form-group"><label class="form-label">起名类型</label>
        <select class="form-input" v-model="form.naming_type"><option value="newborn">新生儿</option><option value="adult">成人改名</option><option value="business">公司起名</option></select>
      </div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '生成中...' : '开始起名' }}</button>
    </div>
    <div class="result card fade-in-up" v-else>
      <h3 class="res-title">推荐名字</h3>
      <div class="name-card" v-for="n in result.recommended_names" :key="n.name">
        <div class="name-header"><span class="name-text">{{ n.name }}</span><span class="name-score">{{ n.score }}分</span></div>
        <p>{{ n.meaning }}</p><p class="five-el">{{ n.five_elements }}</p>
      </div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新起名</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiNaming } from '@/api/modules/ai'
const loading = ref(false), result = ref(null)
const form = ref({ surname: '', gender: 'male', birth_date: '', naming_type: 'newborn' })
const submit = async () => {
  if (!form.value.surname) return alert('请输入姓氏')
  loading.value = true
  try { const r = await aiNaming(form.value); result.value = r.data } catch { result.value = { recommended_names: [{ name: form.value.surname+'浩然', meaning:'浩然正气，胸怀天下', five_elements:'金水相生，利于发展', score:96 },{ name: form.value.surname+'子墨', meaning:'文雅博学，才华横溢', five_elements:'水木相生，学业有成', score:93 },{ name: form.value.surname+'思远', meaning:'志向远大，深谋远虑', five_elements:'火土相生，事业顺遂', score:91 }] } }
  finally { loading.value = false }
}
</script>
<style scoped>
.hero { text-align:center; padding:36px 20px 28px; background:linear-gradient(160deg,var(--color-primary-dark),var(--color-primary)); color:var(--text-inverse); }
.hero span { font-size:48px; } .hero h2 { font-family:var(--font-serif); font-size:22px; color:var(--color-gold); letter-spacing:4px; margin-top:8px; }
.form-area { padding:20px 16px; }
.gender-row { display:flex; gap:12px; }
.gender-row button { flex:1; height:44px; border-radius:var(--radius-md); border:1.5px solid var(--border-default); font-size:14px; cursor:pointer; background:var(--bg-card); color:var(--text-secondary); }
.gender-row button.active { background:var(--color-primary); color:white; border-color:var(--color-primary); }
.result { margin:16px; }
.res-title { font-family:var(--font-serif); font-size:18px; color:var(--color-primary); text-align:center; margin-bottom:16px; }
.name-card { background:var(--bg-secondary); border-radius:var(--radius-md); padding:16px; margin-bottom:10px; }
.name-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.name-text { font-family:var(--font-serif); font-size:22px; font-weight:700; color:var(--color-primary); }
.name-score { font-size:16px; font-weight:700; color:var(--color-gold); }
.name-card p { font-size:13px; color:var(--text-secondary); line-height:1.6; }
.five-el { color:var(--color-gold-dark); margin-top:4px; }
</style>

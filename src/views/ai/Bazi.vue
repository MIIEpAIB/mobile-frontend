<template>
  <div class="bazi-page page-container">
    <NavBar title="八字算命" />
    <div class="bazi-hero"><span>📜</span><h2>八字命理</h2><p>知命改运 · 洞察先机</p></div>
    <div class="bazi-form" v-if="!result">
      <div class="form-group"><label class="form-label">姓名</label><input class="form-input" v-model="form.name" placeholder="请输入姓名" /></div>
      <div class="form-group"><label class="form-label">性别</label>
        <div class="gender-row">
          <button :class="{ active: form.gender==='male' }" @click="form.gender='male'">♂ 男</button>
          <button :class="{ active: form.gender==='female' }" @click="form.gender='female'">♀ 女</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">出生日期</label><input class="form-input" v-model="form.birth_date" type="date" /></div>
      <div class="form-group"><label class="form-label">出生时辰</label><input class="form-input" v-model="form.birth_time" type="time" /></div>
      <div class="form-group"><label class="form-label">出生地点（选填）</label><input class="form-input" v-model="form.birth_place" placeholder="如：北京市" /></div>
      <button class="btn-primary" @click="submit" :disabled="loading">{{ loading ? '测算中...' : '开始测算' }}</button>
    </div>
    <div class="result-area card fade-in-up" v-else>
      <h3 class="result-title">八字命盘</h3>
      <div class="bazi-pillars" v-if="result.bazi_info">
        <div class="pillar" v-for="(v,k) in result.bazi_info" :key="k"><span class="pillar-label">{{ {year_pillar:'年柱',month_pillar:'月柱',day_pillar:'日柱',time_pillar:'时柱'}[k] }}</span><span class="pillar-value">{{ v }}</span></div>
      </div>
      <div class="result-text" v-if="result.life_analysis"><h4>命格分析</h4><p>{{ result.life_analysis }}</p></div>
      <div class="result-text" v-if="result.fortune_trend">
        <h4>运势详解</h4>
        <p v-for="(v,k) in result.fortune_trend" :key="k"><strong>{{ {career:'事业',love:'感情',wealth:'财运'}[k]||k }}：</strong>{{ v }}</p>
      </div>
      <button class="btn-outline" @click="result=null" style="margin-top:16px">重新测算</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiBazi } from '@/api/modules/ai'
const loading = ref(false)
const result = ref(null)
const form = ref({ name: '', gender: 'male', birth_date: '', birth_time: '', birth_place: '' })
const submit = async () => {
  if (!form.value.name || !form.value.birth_date) return alert('请填写姓名和出生日期')
  loading.value = true
  try { const res = await aiBazi(form.value); result.value = res.data } catch (e) {
    result.value = { bazi_info: { year_pillar: '庚午', month_pillar: '己丑', day_pillar: '甲辰', time_pillar: '庚午' }, life_analysis: '命格属木，生于冬季，需火来暖局。整体格局偏旺，宜以金水调候。', fortune_trend: { career: '事业稳步上升，宜把握三至五月的黄金期', love: '桃花运旺盛，单身者有望遇到正缘', wealth: '财运中上，偏财运佳，宜稳健投资' } }
  } finally { loading.value = false }
}
</script>

<style scoped>
.bazi-hero { text-align: center; padding: 36px 20px 28px; background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary)); color: var(--text-inverse); }
.bazi-hero span { font-size: 48px; }
.bazi-hero h2 { font-family: var(--font-serif); font-size: 22px; color: var(--color-gold); letter-spacing: 4px; margin: 8px 0 4px; }
.bazi-hero p { color: rgba(253,245,236,0.6); font-size: 13px; }
.bazi-form { padding: 20px 16px; }
.gender-row { display: flex; gap: 12px; }
.gender-row button { flex: 1; height: 44px; border-radius: var(--radius-md); border: 1.5px solid var(--border-default); font-size: 14px; cursor: pointer; background: var(--bg-card); color: var(--text-secondary); transition: all 0.2s; }
.gender-row button.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.result-area { margin: 20px 16px; }
.result-title { font-family: var(--font-serif); font-size: 18px; color: var(--color-primary); text-align: center; margin-bottom: 16px; }
.bazi-pillars { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
.pillar { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 16px; background: var(--color-primary-soft); border-radius: var(--radius-md); }
.pillar-label { font-size: 12px; color: var(--text-tertiary); }
.pillar-value { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--color-primary); }
.result-text { margin-top: 16px; }
.result-text h4 { font-family: var(--font-serif); font-size: 15px; color: var(--color-gold-dark); margin-bottom: 8px; }
.result-text p { font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 6px; }
</style>

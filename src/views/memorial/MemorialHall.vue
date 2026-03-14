<template>
  <div class="page-container">
    <header class="memorial-header"><span>🕯️</span><h1>祭祀大厅</h1><p>缅怀先人 · 追思故人</p></header>
    <div class="section-title">我的陵墓</div>
    <div class="tomb-list">
      <div class="tomb-card card" v-for="t in tombs" :key="t.tomb_id">
        <div class="tomb-icon">🕯️</div>
        <div class="tomb-info"><h4>{{ t.deceased_name }}</h4><p>{{ t.birth_date }} - {{ t.death_date }}</p></div>
        <button class="btn-offer" @click="offerTo(t)">上供</button>
      </div>
      <div class="add-tomb card" @click="$router.push('/memorial/tomb')">
        <span>+ 创建陵墓</span>
      </div>
    </div>
    <div class="section-title">贡品供奉</div>
    <div class="offerings-grid">
      <div class="offering-item" v-for="o in offerings" :key="o.id">
        <span class="offering-icon">{{ o.icon }}</span>
        <span class="offering-name">{{ o.name }}</span>
        <span class="offering-price">{{ o.price }}功德</span>
      </div>
    </div>
    <div class="section-title">陵园广场</div>
    <div class="feed-list">
      <div class="feed-item card" v-for="f in feeds" :key="f.id">
        <p><strong>{{ f.user }}</strong> 为 <strong>{{ f.deceased }}</strong> {{ f.action }}</p>
        <span class="feed-time">{{ f.time }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getMemorialHallIndex, getOfferingsList, getSquareFeed } from '@/api/modules/memorial'
const tombs = ref([{ tomb_id:1, deceased_name:'先祖', birth_date:'1930', death_date:'2010' }])
const offerings = ref([
  { id:1, icon:'🕯️', name:'香烛', price:10 },
  { id:2, icon:'🌸', name:'鲜花', price:20 },
  { id:3, icon:'🍎', name:'水果', price:15 },
  { id:4, icon:'🍚', name:'供饭', price:30 },
  { id:5, icon:'🍶', name:'美酒', price:25 },
  { id:6, icon:'📜', name:'纸钱', price:10 },
])
const feeds = ref([{ id:1, user:'孝心人', deceased:'先母', action:'供奉了鲜花', time:'5分钟前' }])
onMounted(async () => {
  try { const r = await getMemorialHallIndex(); if(r.data?.tombs) tombs.value = r.data.tombs } catch {}
  try { const r = await getOfferingsList({page_num:1,page_size:20}); if(r.data?.list) offerings.value = r.data.list } catch {}
  try { const r = await getSquareFeed({page_num:1,page_size:10}); if(r.data?.list) feeds.value = r.data.list } catch {}
})
const offerTo = (t) => alert(`已为 ${t.deceased_name} 供奉，功德无量`)
</script>
<style scoped>
.memorial-header { background:linear-gradient(160deg,#1a0a0a,#2a1010,#3a1a1a); padding:40px 20px 36px; text-align:center; color:var(--text-inverse); }
.memorial-header span { font-size:56px; }
.memorial-header h1 { font-family:var(--font-serif); font-size:24px; color:var(--color-gold); letter-spacing:4px; margin:8px 0 4px; }
.memorial-header p { color:rgba(253,245,236,0.4); font-size:13px; }
.tomb-list { padding:0 16px; }
.tomb-card { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
.tomb-icon { font-size:32px; }
.tomb-info { flex:1; } .tomb-info h4 { font-size:15px; } .tomb-info p { font-size:12px; color:var(--text-tertiary); }
.btn-offer { padding:6px 16px; background:var(--color-gold); color:white; border-radius:var(--radius-full); font-size:13px; font-weight:600; cursor:pointer; }
.add-tomb { text-align:center; color:var(--color-primary); font-size:15px; cursor:pointer; margin-bottom:8px; }
.offerings-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:0 16px 16px; }
.offering-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:16px 8px; background:var(--bg-card); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border-light); }
.offering-icon { font-size:32px; }
.offering-name { font-size:13px; font-weight:500; }
.offering-price { font-size:11px; color:var(--color-gold-dark); }
.feed-list { padding:0 16px 16px; }
.feed-item { margin-bottom:8px; } .feed-item p { font-size:14px; } .feed-time { font-size:12px; color:var(--text-tertiary); }
</style>

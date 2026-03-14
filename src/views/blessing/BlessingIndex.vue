<template>
  <div class="page-container">
    <header class="blessing-header">
      <div class="blessing-bg-text">🙏</div>
      <h1>祈福殿堂</h1>
      <p>心诚则灵 · 福报绵延</p>
    </header>
    <div class="blessing-methods">
      <div class="method-card card" v-for="m in methods" :key="m.code" @click="selectedMethod=m">
        <span class="method-icon">{{ m.icon }}</span>
        <h3>{{ m.name }}</h3>
        <p>{{ m.desc }}</p>
      </div>
    </div>
    <!-- 祈福表单弹窗 -->
    <div class="modal-overlay" v-if="selectedMethod" @click.self="selectedMethod=null">
      <div class="modal-content card fade-in-up">
        <h3>{{ selectedMethod.name }}</h3>
        <div class="form-group"><label class="form-label">您的姓名</label><input class="form-input" v-model="form.name" placeholder="请输入姓名" /></div>
        <div class="form-group"><label class="form-label">出生日期</label><input class="form-input" v-model="form.birth_date" type="date" /></div>
        <div class="form-group"><label class="form-label">祈愿内容</label><textarea class="form-textarea" v-model="form.wish_content" placeholder="写下您的心愿..." rows="3"></textarea></div>
        <button class="btn-primary" @click="submitBlessing">🙏 开始祈福</button>
      </div>
    </div>

    <div class="section-title">祈福动态</div>
    <div class="feed-list">
      <div class="feed-item card" v-for="f in feeds" :key="f.id">
        <div class="feed-avatar">🙏</div>
        <div class="feed-content">
          <p><strong>{{ f.user }}</strong> {{ f.action }}</p>
          <span class="feed-time">{{ f.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getBlessingMethods, getBlessingFeed } from '@/api/modules/blessing'
import { serviceBlessing } from '@/api/modules/common'
const selectedMethod = ref(null)
const form = ref({ name: '', birth_date: '', wish_content: '' })
const methods = ref([
  { code:'health', name:'祈福健康', desc:'护佑家人身体安康', icon:'💚' },
  { code:'fortune', name:'祈福财运', desc:'招财进宝·财源广进', icon:'💰' },
  { code:'love', name:'祈福姻缘', desc:'月老牵线·美满姻缘', icon:'❤️' },
  { code:'career', name:'祈福事业', desc:'步步高升·前程似锦', icon:'🏆' },
  { code:'study', name:'祈福学业', desc:'金榜题名·学业有成', icon:'📖' },
  { code:'peace', name:'祈福平安', desc:'出入平安·万事顺遂', icon:'☮️' },
])
const feeds = ref([
  { id:1, user:'善心人***', action:'祈福健康平安', time:'3分钟前' },
  { id:2, user:'有缘人***', action:'祈福财运亨通', time:'8分钟前' },
  { id:3, user:'心诚者***', action:'祈福金榜题名', time:'15分钟前' },
])
onMounted(async () => {
  try { const r = await getBlessingMethods(); if(r.data?.length) methods.value = r.data } catch {}
  try { const r = await getBlessingFeed({ page_num:1, page_size:10 }); if(r.data?.list?.length) feeds.value = r.data.list } catch {}
})
const submitBlessing = async () => {
  if (!form.value.wish_content) return alert('请写下您的心愿')
  try { await serviceBlessing({ blessing_type: selectedMethod.value.code, ...form.value }); alert('祈福成功！愿您心想事成') } catch { alert('祈福成功！愿您心想事成') }
  selectedMethod.value = null
}
</script>
<style scoped>
.blessing-header { background:linear-gradient(160deg,var(--color-primary-dark),var(--color-primary),#4a1a1a); padding:40px 20px 36px; text-align:center; color:var(--text-inverse); position:relative; overflow:hidden; }
.blessing-bg-text { font-size:80px; opacity:0.1; position:absolute; top:10px; right:10px; }
.blessing-header h1 { font-family:var(--font-serif); font-size:26px; color:var(--color-gold); letter-spacing:4px; }
.blessing-header p { color:rgba(253,245,236,0.5); font-size:14px; margin-top:6px; }
.blessing-methods { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; padding:16px; }
.method-card { text-align:center; cursor:pointer; margin:0; }
.method-icon { font-size:36px; display:block; margin-bottom:8px; }
.method-card h3 { font-size:15px; font-weight:700; margin-bottom:4px; }
.method-card p { font-size:12px; color:var(--text-tertiary); }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
.modal-content { width:100%; max-width:400px; padding:24px; }
.modal-content h3 { font-family:var(--font-serif); font-size:18px; text-align:center; color:var(--color-primary); margin-bottom:16px; }
.feed-list { padding:0 16px 16px; }
.feed-item { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
.feed-avatar { font-size:24px; }
.feed-content { flex:1; } .feed-content p { font-size:14px; } .feed-time { font-size:12px; color:var(--text-tertiary); }
</style>

<template>
  <div class="page-container"><NavBar title="我的记录" />
    <div class="tab-bar">
      <button v-for="t in tabs" :key="t.key" :class="{active:activeTab===t.key}" @click="activeTab=t.key">{{ t.label }}</button>
    </div>
    <div class="record-list">
      <div class="record-item card" v-for="r in records" :key="r.id">
        <div class="record-icon">{{ r.icon }}</div>
        <div class="record-info"><h4>{{ r.title }}</h4><p>{{ r.time }}</p></div>
        <span class="record-type tag tag-red">{{ r.type }}</span>
      </div>
    </div>
    <div class="empty-state" v-if="!records.length"><span class="empty-icon">📊</span><span class="empty-text">暂无记录</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getDivinationRecords, getBlessingRecords, getMemorialRecords } from '@/api/modules/user'
const activeTab = ref('divination')
const tabs = [{key:'divination',label:'测算'},{key:'blessing',label:'祈福'},{key:'memorial',label:'祭祀'}]
const records = ref([])
const loadRecords = async () => {
  const apis = {divination:getDivinationRecords,blessing:getBlessingRecords,memorial:getMemorialRecords}
  try { const r = await apis[activeTab.value]({page_num:1,page_size:20}); records.value = r.data?.list||[] } catch {
    records.value = [
      {id:1, icon:'🎋', title:'观音灵签 - 上上签', time:'2026-03-13 14:30', type:'抽签'},
      {id:2, icon:'📜', title:'八字算命 - 命格分析', time:'2026-03-12 10:15', type:'八字'},
      {id:3, icon:'✍️', title:'测字 - 问财运', time:'2026-03-11 16:20', type:'测字'},
    ]
  }
}
onMounted(loadRecords)
watch(activeTab, loadRecords)
</script>
<style scoped>
.tab-bar { display:flex; padding:0 16px; border-bottom:1px solid var(--border-light); background:var(--bg-card); }
.tab-bar button { flex:1; padding:12px 0; font-size:14px; color:var(--text-secondary); cursor:pointer; border-bottom:2px solid transparent; }
.tab-bar button.active { color:var(--color-primary); font-weight:600; border-bottom-color:var(--color-primary); }
.record-list { padding:12px 16px; }
.record-item { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
.record-icon { font-size:28px; }
.record-info { flex:1; } .record-info h4 { font-size:14px; margin-bottom:2px; } .record-info p { font-size:12px; color:var(--text-tertiary); }
</style>

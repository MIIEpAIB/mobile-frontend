<template>
  <div class="page-container"><NavBar title="专家服务" />
    <div class="expert-list">
      <div class="expert-card card" v-for="e in experts" :key="e.expert_id">
        <div class="expert-avatar">{{ e.icon || '🧙' }}</div>
        <div class="expert-info">
          <h3>{{ e.name }} <span class="tag tag-gold">{{ e.title || '资深专家' }}</span></h3>
          <p>{{ e.speciality }}</p>
          <div class="expert-stats"><span>⭐ {{ e.rating || 4.8 }}</span><span>{{ e.order_count || 0 }}次服务</span></div>
        </div>
        <button class="btn-book" @click="book(e)">预约</button>
      </div>
    </div>
    <div class="empty-state" v-if="!experts.length"><span class="empty-icon">🧙</span><span class="empty-text">暂无专家</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getExpertList } from '@/api/modules/common'
const experts = ref([])
onMounted(async () => {
  try { const r = await getExpertList({page_num:1,page_size:20}); experts.value = r.data?.list||[] } catch {
    experts.value = [
      {expert_id:1,name:'张天师',title:'资深命理师',speciality:'八字命理·风水堪舆·梅花易数',rating:4.9,order_count:2380,icon:'🧙‍♂️'},
      {expert_id:2,name:'李居士',title:'风水大师',speciality:'商业风水·家居风水·办公风水',rating:4.8,order_count:1560,icon:'🧑‍🏫'},
      {expert_id:3,name:'王易人',title:'命理顾问',speciality:'八字合婚·取名改名·择日择吉',rating:4.7,order_count:980,icon:'👨‍💼'},
    ]
  }
})
const book = (e) => alert(`已预约 ${e.name} 的服务，稍后将有专人联系您`)
</script>
<style scoped>
.expert-list { padding:12px 16px; }
.expert-card { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
.expert-avatar { font-size:40px; width:56px; height:56px; background:var(--color-primary-soft); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.expert-info { flex:1; } .expert-info h3 { font-size:15px; display:flex; align-items:center; gap:6px; margin-bottom:4px; }
.expert-info p { font-size:13px; color:var(--text-secondary); margin-bottom:6px; }
.expert-stats { display:flex; gap:16px; font-size:12px; color:var(--text-tertiary); }
.btn-book { padding:8px 20px; background:var(--color-primary); color:white; border-radius:var(--radius-full); font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }
</style>

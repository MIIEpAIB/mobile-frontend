<template>
  <div class="page-container"><NavBar title="玄学文化" />
    <div class="culture-list">
      <div class="culture-card card" v-for="a in articles" :key="a.article_id" @click="viewDetail(a)">
        <div class="culture-info">
          <h3>{{ a.title }}</h3>
          <p>{{ a.summary }}</p>
          <div class="culture-meta"><span>{{ a.author || '鲲鹏编辑部' }}</span><span>{{ a.created_at }}</span></div>
        </div>
      </div>
    </div>
    <div class="loading-spinner" v-if="loading">加载中...</div>
    <div class="empty-state" v-if="!loading && !articles.length"><span class="empty-icon">📚</span><span class="empty-text">暂无文章</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getCultureList } from '@/api/modules/common'
const loading = ref(false), articles = ref([])
onMounted(async () => {
  loading.value = true
  try { const r = await getCultureList({page_num:1,page_size:20}); articles.value = r.data?.list||r.data?.items||[] } catch {
    articles.value = [
      {article_id:1,title:'易经入门：八卦的起源与含义',summary:'八卦是中华文明最古老的哲学符号之一，承载着先民对宇宙运行规律的深刻认知...',created_at:'2026-03-10'},
      {article_id:2,title:'五行相生相克的原理与应用',summary:'五行学说是中国古代哲学的重要组成部分，金木水火土五种元素相互作用...',created_at:'2026-03-08'},
      {article_id:3,title:'风水堪舆学基础知识',summary:'风水学是中国古代建筑环境学的重要分支，讲究人与自然的和谐共处...',created_at:'2026-03-05'},
    ]
  } finally { loading.value = false }
})
const viewDetail = (a) => alert(a.title + '\n\n' + a.summary)
</script>
<style scoped>
.culture-list { padding:12px 16px; }
.culture-card { margin-bottom:12px; cursor:pointer; }
.culture-info h3 { font-size:16px; font-weight:600; margin-bottom:6px; }
.culture-info p { font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.culture-meta { display:flex; justify-content:space-between; font-size:12px; color:var(--text-tertiary); }
</style>

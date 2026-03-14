<template>
  <div class="page-container"><NavBar title="风水知识" />
    <div class="search-bar"><input class="form-input" v-model="keyword" placeholder="搜索风水知识..." @keyup.enter="search" /></div>
    <div class="category-list">
      <div class="cat-card card" v-for="c in categories" :key="c.id" @click="selectCategory(c)">
        <span class="cat-icon">{{ c.icon }}</span>
        <h3>{{ c.name }}</h3>
        <p>{{ c.desc }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getFengshuiCategoryTree } from '@/api/modules/common'
const keyword = ref('')
const categories = ref([
  {id:1,name:'家居风水',desc:'居家布局·房屋朝向',icon:'🏠'},
  {id:2,name:'办公风水',desc:'办公室布局·商铺选址',icon:'🏢'},
  {id:3,name:'阴宅风水',desc:'墓地选址·陵墓堪舆',icon:'⛩️'},
  {id:4,name:'风水摆件',desc:'物品摆放·开运物品',icon:'🪷'},
  {id:5,name:'择日择吉',desc:'嫁娶吉日·开业良辰',icon:'📅'},
  {id:6,name:'风水常识',desc:'基础知识·入门学习',icon:'📖'},
])
onMounted(async () => { try { const r = await getFengshuiCategoryTree(); if(r.data?.length) categories.value = r.data } catch {} })
const search = () => alert('搜索: ' + keyword.value)
const selectCategory = (c) => alert('进入: ' + c.name)
</script>
<style scoped>
.search-bar { padding:12px 16px; }
.category-list { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; padding:0 16px; }
.cat-card { text-align:center; cursor:pointer; margin:0; }
.cat-icon { font-size:36px; display:block; margin-bottom:8px; }
.cat-card h3 { font-size:15px; font-weight:600; margin-bottom:4px; }
.cat-card p { font-size:12px; color:var(--text-tertiary); }
</style>

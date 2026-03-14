<template>
  <div class="page-container">
    <header class="mall-header"><h1>🛍️ 开光商城</h1><p>大师开光 · 灵验护身</p></header>
    <div class="filter-bar">
      <button v-for="c in categories" :key="c" class="filter-btn" :class="{active:activeCategory===c}" @click="activeCategory=c">{{ c }}</button>
    </div>
    <div class="product-grid">
      <div class="product-card card" v-for="p in products" :key="p.product_id" @click="$router.push('/mall/detail?product_id='+p.product_id)">
        <div class="product-img">{{ p.icon || '🪷' }}</div>
        <div class="product-info">
          <h3>{{ p.product_name || p.name }}</h3>
          <p class="product-desc">{{ p.description || '开光法器' }}</p>
          <div class="product-bottom">
            <span class="product-price">¥{{ p.price || 0 }}</span>
            <span class="product-sales">已售{{ p.sales || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="loading-spinner" v-if="loading">加载中...</div>
    <div class="empty-state" v-if="!loading && products.length===0"><span class="empty-icon">🛍️</span><span class="empty-text">暂无商品</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getProductList } from '@/api/modules/mall'
const loading = ref(false), products = ref([]), activeCategory = ref('全部')
const categories = ['全部','护身符','手串','摆件','开光法器','挂件']
onMounted(async () => {
  loading.value = true
  try { const r = await getProductList({ page_num: 1, page_size: 20 }); products.value = r.data?.list || r.data?.items || [] } catch {
    products.value = [
      { product_id: 1, product_name: '开光黑曜石貔貅手串', price: 299, sales: 1280, icon: '📿' },
      { product_id: 2, product_name: '太岁符平安护身符', price: 168, sales: 2350, icon: '🧧' },
      { product_id: 3, product_name: '招财进宝铜葫芦', price: 458, sales: 860, icon: '🏺' },
      { product_id: 4, product_name: '开光玉佛吊坠', price: 688, sales: 560, icon: '🪷' },
      { product_id: 5, product_name: '五帝钱镇宅摆件', price: 328, sales: 920, icon: '🪙' },
      { product_id: 6, product_name: '红绳桃花手链', price: 128, sales: 3200, icon: '🧶' },
    ]
  } finally { loading.value = false }
})
</script>
<style scoped>
.mall-header { background:linear-gradient(135deg,var(--color-primary-dark),var(--color-primary)); padding:24px 20px 32px; color:var(--text-inverse); text-align:center; }
.mall-header h1 { font-family:var(--font-serif); font-size:22px; color:var(--color-gold); letter-spacing:3px; }
.mall-header p { font-size:13px; color:rgba(253,245,236,0.5); margin-top:4px; }
.filter-bar { display:flex; gap:8px; padding:12px 16px; overflow-x:auto; }
.filter-btn { padding:6px 16px; border-radius:var(--radius-full); font-size:13px; white-space:nowrap; border:1px solid var(--border-default); color:var(--text-secondary); background:var(--bg-card); cursor:pointer; }
.filter-btn.active { background:var(--color-primary); color:white; border-color:var(--color-primary); }
.product-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; padding:0 16px 16px; }
.product-card { margin:0; cursor:pointer; padding:0; overflow:hidden; }
.product-img { height:140px; background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:56px; }
.product-info { padding:12px; }
.product-info h3 { font-size:14px; font-weight:600; margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.product-desc { font-size:12px; color:var(--text-tertiary); margin-bottom:8px; }
.product-bottom { display:flex; justify-content:space-between; align-items:center; }
.product-price { font-size:16px; font-weight:700; color:var(--color-primary); }
.product-sales { font-size:11px; color:var(--text-tertiary); }
</style>

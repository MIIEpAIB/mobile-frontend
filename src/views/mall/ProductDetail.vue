<template>
  <div class="page-container">
    <NavBar title="商品详情" />
    <div class="detail-img">{{ product.icon || '🪷' }}</div>
    <div class="detail-info card">
      <div class="detail-price">{{ (Number(product.price || 0) * 10).toFixed(0) }} 元宝</div>
      <h2 class="detail-name">{{ product.product_name || '加载中...' }}</h2>
      <p class="detail-desc">{{ product.description || '' }}</p>
      <div class="detail-tags"><span class="tag tag-red">已开光</span><span class="tag tag-gold">正品保证</span></div>
    </div>
    <div class="detail-section card">
      <h3 class="section-title">商品介绍</h3>
      <p class="detail-content">{{ product.content || '此法器经高僧开光加持，具有辟邪保平安之功效。材质上等，做工精良，适合日常佩戴或置于家中镇宅。' }}</p>
    </div>
    <div class="detail-actions">
      <button class="btn-disabled" disabled>暂不支持收藏</button>
      <button class="btn-disabled" disabled>暂不支持下单付款</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getProductDetail } from '@/api/modules/mall'
const route = useRoute()
const product = ref({})
onMounted(async () => {
  try { const r = await getProductDetail({ product_id: route.query.product_id }); product.value = r.data } catch { product.value = { product_name: '开光黑曜石貔貅手串', price: 299, icon: '📿', description: '天然黑曜石配貔貅造型，大师开光加持', sales: 1280 } }
})
</script>
<style scoped>
.detail-img { height:280px; background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:96px; }
.detail-info { margin:12px 16px; }
.detail-price { font-size:28px; font-weight:900; color:var(--color-primary); margin-bottom:8px; }
.detail-name { font-size:18px; font-weight:700; margin-bottom:8px; }
.detail-desc { font-size:14px; color:var(--text-secondary); margin-bottom:12px; }
.detail-tags { display:flex; gap:8px; }
.detail-section { margin:0 16px 16px; }
.detail-content { font-size:14px; color:var(--text-secondary); line-height:1.8; }
.detail-actions { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; display:flex; gap:0; background:var(--bg-card); padding:12px 16px calc(12px + var(--safe-bottom)); border-top:1px solid var(--border-light); z-index:100; }
.btn-disabled { flex:1; height:44px; border-radius:var(--radius-full); background:#c8c8c8; color:#666; font-size:14px; font-weight:600; cursor:not-allowed; }
</style>

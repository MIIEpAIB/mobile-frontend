<template>
  <div class="page-container page-with-bottom-bar">
    <NavBar title="商品详情" />
    <div class="detail-img">
      <img v-if="imageUrl" :src="imageUrl" alt="商品图片" class="detail-photo" />
      <span v-else>{{ product.icon || '🪷' }}</span>
    </div>
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
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="detail-actions">
      <div class="qty-row">
        <span class="qty-label">数量</span>
        <div class="qty-ctrl">
          <button type="button" class="qty-btn" :disabled="quantity <= 1" @click="quantity > 1 && quantity--">−</button>
          <span class="qty-val">{{ quantity }}</span>
          <button type="button" class="qty-btn" :disabled="maxQty !== null && quantity >= maxQty" @click="incQty">+</button>
        </div>
      </div>
      <div class="action-btns">
        <button type="button" class="btn-secondary" @click="onAddCart">加入购物车</button>
        <button type="button" class="btn-primary" @click="onBuyNow">立即下单</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getProductDetail, addToCart } from '@/api/modules/mall'
const route = useRoute()
const router = useRouter()
const product = ref({})
const quantity = ref(1)
const toast = ref('')
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

const normalizeImageUrl = (raw) => {
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith('/')) return `${apiBase}${raw}`
  return `${apiBase}/${raw}`
}

const imageUrl = computed(() => {
  const p = product.value || {}
  const firstFromList = Array.isArray(p.product_images) ? p.product_images.find((it) => !!it) : ''
  // 优先后端标准字段，其次兼容之前的 icon 字段
  return normalizeImageUrl(firstFromList || p.product_image || p.main_image || p.image || p.icon || '')
})

const maxQty = computed(() => {
  const s = Number(product.value?.stock)
  if (!Number.isFinite(s) || s <= 0) return null
  return s
})

const showToast = (msg) => {
  toast.value = msg
  window.setTimeout(() => {
    toast.value = ''
  }, 1600)
}

const incQty = () => {
  if (maxQty.value !== null && quantity.value >= maxQty.value) return
  quantity.value += 1
}

const checkoutPayload = () => {
  const p = product.value || {}
  const pid = String(route.query.product_id || p.product_id || '')
  return [
    {
      product_id: pid,
      product_name: p.product_name || '',
      price: Number(p.price || 0),
      quantity: quantity.value,
      icon: p.icon || '',
    },
  ]
}

const onAddCart = async () => {
  const pid = String(route.query.product_id || product.value?.product_id || '')
  if (!pid) {
    showToast('缺少商品信息')
    return
  }
  try {
    await addToCart({ product_id: pid, quantity: quantity.value })
    showToast('已加入购物车')
  } catch (e) {
    showToast(e?.message || '加入失败')
  }
}

const onBuyNow = () => {
  const pid = String(route.query.product_id || product.value?.product_id || '')
  if (!pid) {
    showToast('缺少商品信息')
    return
  }
  try {
    sessionStorage.setItem('mall_checkout_items', JSON.stringify(checkoutPayload()))
  } catch {
    // ignore
  }
  router.push('/mall/order-confirm')
}

onMounted(async () => {
  try { const r = await getProductDetail({ product_id: route.query.product_id }); product.value = r.data } catch { product.value = { product_name: '开光黑曜石貔貅手串', price: 299, icon: '📿', description: '天然黑曜石配貔貅造型，大师开光加持', sales: 1280 } }
})
</script>
<style scoped>
.page-with-bottom-bar { padding-bottom: 120px; }
.detail-img { height:280px; background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:96px; }
.detail-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.detail-info { margin:12px 16px; }
.detail-price { font-size:28px; font-weight:900; color:var(--color-primary); margin-bottom:8px; }
.detail-name { font-size:18px; font-weight:700; margin-bottom:8px; }
.detail-desc { font-size:14px; color:var(--text-secondary); margin-bottom:12px; }
.detail-tags { display:flex; gap:8px; }
.detail-section { margin:0 16px 16px; }
.detail-content { font-size:14px; color:var(--text-secondary); line-height:1.8; }
.detail-actions {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-card);
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid var(--border-light);
  z-index: 100;
}
.qty-row { display: flex; align-items: center; justify-content: space-between; }
.qty-label { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.qty-ctrl { display: flex; align-items: center; gap: 10px; }
.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-default);
  background: var(--bg-secondary);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.qty-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.qty-val { min-width: 24px; text-align: center; font-weight: 700; }
.action-btns { display: flex; gap: 10px; }
.btn-secondary {
  flex: 1;
  height: 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.btn-primary {
  flex: 1;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 96px;
  transform: translateX(-50%);
  z-index: 200;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  max-width: 80%;
  text-align: center;
}
</style>

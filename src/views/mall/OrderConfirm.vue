<template>
  <div class="page-container page-with-bottom-bar"><NavBar title="确认订单" />
    <div class="section card addr-card">
      <div class="addr-head">
        <h3 class="sec-title">📍 收货地址</h3>
        <button type="button" class="link-btn" @click="router.push('/user/address')">管理</button>
      </div>
      <p class="addr-text">{{ addressText || '请先在「收货地址」中添加默认地址' }}</p>
    </div>
    <div class="section card"><h3 class="sec-title">商品信息</h3>
      <div class="order-item" v-for="i in orderItems" :key="i.product_id">
        <span class="oi-icon">
          <img v-if="isImage(i.icon)" :src="normalizeImage(i.icon)" class="oi-img" alt="" />
          <span v-else>{{ i.icon || '📿' }}</span>
        </span>
        <div class="oi-info"><span>{{ i.product_name }}</span><span class="oi-price">{{ Number(i.price || 0) * 10 }}元宝 × {{ i.quantity }}</span></div>
      </div>
    </div>
    <div class="section card total-section"><div class="total-row"><span>商品合计</span><span>{{ total * 10 }}元宝</span></div><div class="total-row big"><span>实付金额</span><span class="pay-amount">{{ total * 10 }}元宝</span></div></div>
    <div class="submit-bar"><button class="btn-primary" :disabled="submitting || !orderItems.length" @click="submitOrder">{{ submitting ? '提交中…' : '提交订单' }}</button></div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { createOrder } from '@/api/modules/mall'
import { getAddressList } from '@/api/modules/user'
const router = useRouter()
const addressText = ref('')
const addressId = ref('')
const orderItems = ref([])
const submitting = ref(false)
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

const normalizeImage = (raw) => {
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith('/')) return `${apiBase}${raw}`
  return `${apiBase}/${raw}`
}

const isImage = (raw) => {
  if (!raw || typeof raw !== 'string') return false
  if (/^https?:\/\//i.test(raw)) return true
  return raw.startsWith('/') && /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(raw)
}

const total = computed(() => orderItems.value.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0))

const loadCheckoutItems = () => {
  try {
    const raw = sessionStorage.getItem('mall_checkout_items')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        orderItems.value = parsed
        return
      }
    }
  } catch {
    // ignore
  }
  orderItems.value = [{ product_id: 1, product_name: '开光黑曜石手串', price: 299, quantity: 1, icon: '📿' }]
}

const loadDefaultAddress = async () => {
  try {
    const r = await getAddressList()
    const list = r.data?.list || r.data || []
    const def = list.find((a) => a.is_default) || list[0]
    if (!def) return
    addressId.value = String(def.id ?? def.address_id ?? '')
    const phone = def.phone || def.mobile || ''
    addressText.value = `${def.province || ''}${def.city || ''}${def.district || ''}${def.detail || ''}（${def.name || ''} ${phone}）`.trim()
  } catch {
    addressText.value = '北京市朝阳区XX路XX号（张三 13800138000）'
    addressId.value = ''
  }
}

const submitOrder = async () => {
  if (!orderItems.value.length) return
  submitting.value = true
  try {
    const ids = []
    for (const it of orderItems.value) {
      const r = await createOrder({
        product_id: String(it.product_id),
        quantity: Number(it.quantity || 1),
        address_id: addressId.value,
      })
      const oid = r.data?.order_id || r.data?.id || ''
      if (oid) ids.push(String(oid))
    }
    try {
      sessionStorage.removeItem('mall_checkout_items')
    } catch {
      // ignore
    }
    alert(ids.length ? `订单提交成功：${ids.join('，')}` : '订单提交成功！')
    router.push('/user/orders')
  } catch (e) {
    alert(e?.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loadCheckoutItems()
  await loadDefaultAddress()
})
</script>
<style scoped>
.page-with-bottom-bar { padding-bottom: 88px; }
.section { margin:12px 16px; } .sec-title { font-size:15px; font-weight:600; margin-bottom:10px; }
.addr-card .addr-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.link-btn { border:none; background:transparent; color:var(--color-primary); font-size:13px; font-weight:700; cursor:pointer; }
.addr-text { font-size:14px; color:var(--text-secondary); }
.order-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-light); }
.oi-icon { font-size:32px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; }
.oi-img { width:40px; height:40px; border-radius:8px; object-fit:cover; }
.oi-info { flex:1; display:flex; justify-content:space-between; font-size:14px; }
.oi-price { color:var(--text-secondary); }
.total-row { display:flex; justify-content:space-between; padding:8px 0; font-size:14px; color:var(--text-secondary); }
.total-row.big { font-size:16px; font-weight:700; color:var(--text-primary); border-top:1px solid var(--border-light); padding-top:12px; margin-top:4px; }
.pay-amount { color:var(--color-primary); font-size:20px; }
.submit-bar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; padding:12px 16px calc(12px + var(--safe-bottom)); background:var(--bg-card); border-top:1px solid var(--border-light); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
</style>

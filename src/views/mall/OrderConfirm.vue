<template>
  <div class="page-container page-with-bottom-bar">
    <NavBar title="确认订单" />

    <template v-if="stage === 'edit'">
      <div class="section card addr-card">
        <div class="addr-head">
          <h3 class="sec-title">📍 收货地址</h3>
          <button type="button" class="link-btn" @click="router.push('/user/address')">管理</button>
        </div>
        <div v-if="addresses.length" class="addr-pick">
          <div
            v-for="a in addresses"
            :key="a.id || a.address_id"
            class="addr-option"
            :class="{ active: selectedAddressId === String(a.id ?? a.address_id) }"
            @click="selectedAddressId = String(a.id ?? a.address_id)"
          >
            <div class="addr-line1">{{ a.name || a.receiver_name }} {{ a.phone || a.receiver_phone }}</div>
            <div class="addr-line2">{{ a.province }}{{ a.city }}{{ a.district }}{{ a.detail || a.detail_address }}</div>
            <span v-if="a.is_default" class="mini-tag">默认</span>
          </div>
        </div>
        <p v-else class="addr-empty">请先在「收货地址」中添加地址，再下单。</p>
      </div>

      <div class="section card">
        <h3 class="sec-title">支付方式</h3>
        <div class="pay-methods">
          <label class="pay-item"><input type="radio" v-model="payMethod" value="balance" /> 余额（元宝）</label>
          <label class="pay-item"><input type="radio" v-model="payMethod" value="wechat" /> 微信支付</label>
          <label class="pay-item"><input type="radio" v-model="payMethod" value="alipay" /> 支付宝</label>
        </div>
        <p class="pay-tip">说明：微信/支付宝当前为联调模拟，提交付款后会直接记为已支付（不接真实收银台）。</p>
      </div>

      <div class="section card">
        <h3 class="sec-title">商品信息</h3>
        <div class="order-item" v-for="i in orderItems" :key="i.product_id">
          <span class="oi-icon">
            <img v-if="isImage(i.icon)" :src="normalizeImage(i.icon)" class="oi-img" alt="" />
            <span v-else>{{ i.icon || '📿' }}</span>
          </span>
          <div class="oi-info">
            <span>{{ i.product_name }}</span>
            <span class="oi-price">{{ Number(i.price || 0) * 10 }}元宝 × {{ i.quantity }}</span>
          </div>
        </div>
      </div>

      <div class="section card total-section">
        <div class="total-row"><span>商品合计</span><span>{{ total * 10 }}元宝</span></div>
        <div class="total-row big"><span>应付金额</span><span class="pay-amount">{{ total * 10 }}元宝</span></div>
      </div>
    </template>

    <template v-else>
      <div class="section card">
        <h3 class="sec-title">待支付订单</h3>
        <p class="row">订单号：<strong>{{ pendingOrder?.order_no }}</strong></p>
        <p class="row">应付：<strong class="pay-amount">{{ Number(pendingOrder?.total_amount || 0) * 10 }} 元宝</strong></p>
        <p class="row muted">支付方式：{{ payLabel(payMethod) }}</p>
      </div>
    </template>

    <div class="submit-bar">
      <button v-if="stage === 'edit'" class="btn-primary" :disabled="submitting || !orderItems.length || !selectedAddressId" @click="createMallOrder">
        {{ submitting ? '提交中…' : '提交订单' }}
      </button>
      <button v-else class="btn-primary" :disabled="paying" @click="payMallOrder">{{ paying ? '支付中…' : '确认付款' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { createOrder, payOrder } from '@/api/modules/mall'
import { getAddressList } from '@/api/modules/user'

const router = useRouter()
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

const stage = ref('edit') // edit | pay
const addresses = ref([])
const selectedAddressId = ref('')
const payMethod = ref('balance')
const orderItems = ref([])
const submitting = ref(false)
const paying = ref(false)
const pendingOrder = ref(null)

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

const payLabel = (m) => ({ balance: '余额（元宝）', wechat: '微信支付', alipay: '支付宝' }[m] || m)

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

const loadAddresses = async () => {
  try {
    const r = await getAddressList()
    addresses.value = r.data?.list || r.data || []
    const def = addresses.value.find((a) => a.is_default) || addresses.value[0]
    if (def) {
      selectedAddressId.value = String(def.id ?? def.address_id ?? '')
    }
  } catch {
    addresses.value = []
    selectedAddressId.value = ''
  }
}

const createMallOrder = async () => {
  if (!orderItems.value.length) return
  if (!selectedAddressId.value) {
    alert('请选择收货地址')
    return
  }
  submitting.value = true
  try {
    const r = await createOrder({
      address_id: selectedAddressId.value,
      pay_method: payMethod.value,
      items: orderItems.value.map((it) => ({
        product_id: String(it.product_id),
        quantity: Number(it.quantity || 1),
      })),
    })
    pendingOrder.value = r.data
    stage.value = 'pay'
  } catch (e) {
    alert(e?.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

const payMallOrder = async () => {
  if (!pendingOrder.value?.order_id) return
  paying.value = true
  try {
    await payOrder({
      order_id: String(pendingOrder.value.order_id),
      pay_method: payMethod.value,
    })
    try {
      sessionStorage.removeItem('mall_checkout_items')
    } catch {
      // ignore
    }
    alert('支付成功')
    router.push('/user/records')
  } catch (e) {
    alert(e?.message || '支付失败')
  } finally {
    paying.value = false
  }
}

onMounted(async () => {
  loadCheckoutItems()
  await loadAddresses()
})
</script>

<style scoped>
.page-with-bottom-bar {
  padding-bottom: 88px;
}
.section {
  margin: 12px 16px;
}
.sec-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}
.addr-card .addr-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.link-btn {
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.addr-pick {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.addr-option {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  cursor: pointer;
}
.addr-option.active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}
.addr-line1 {
  font-size: 14px;
  font-weight: 600;
}
.addr-line2 {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.mini-tag {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #ffe8e8;
  color: #c00;
}
.addr-empty {
  font-size: 14px;
  color: var(--text-secondary);
}
.pay-methods {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pay-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pay-tip {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.5;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}
.oi-icon {
  font-size: 32px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oi-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.oi-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.oi-price {
  color: var(--text-secondary);
}
.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.total-row.big {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
  margin-top: 4px;
}
.pay-amount {
  color: var(--color-primary);
  font-size: 20px;
}
.row {
  font-size: 14px;
  margin-bottom: 8px;
}
.muted {
  color: var(--text-tertiary);
  font-size: 13px;
}
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  background: var(--bg-card);
  border-top: 1px solid var(--border-light);
}
.btn-primary {
  width: 100%;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>

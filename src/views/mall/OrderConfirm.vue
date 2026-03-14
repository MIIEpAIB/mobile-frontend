<template>
  <div class="page-container"><NavBar title="确认订单" />
    <div class="section card"><h3 class="sec-title">📍 收货地址</h3><p class="addr-text">{{ address || '请添加收货地址' }}</p></div>
    <div class="section card"><h3 class="sec-title">商品信息</h3><div class="order-item" v-for="i in orderItems" :key="i.product_id"><span class="oi-icon">{{ i.icon||'📿' }}</span><div class="oi-info"><span>{{ i.product_name }}</span><span class="oi-price">¥{{ i.price }} × {{ i.quantity }}</span></div></div></div>
    <div class="section card total-section"><div class="total-row"><span>商品合计</span><span>¥{{ total }}</span></div><div class="total-row big"><span>实付金额</span><span class="pay-amount">¥{{ total }}</span></div></div>
    <div class="submit-bar"><button class="btn-primary" @click="submitOrder">提交订单</button></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
const router = useRouter()
const address = ref('北京市朝阳区XX路XX号（张三 13800138000）')
const orderItems = ref([{ product_id:1, product_name:'开光黑曜石手串', price:299, quantity:1, icon:'📿' }])
const total = computed(() => orderItems.value.reduce((s,i)=>s+i.price*i.quantity, 0))
const submitOrder = () => { alert('订单提交成功！'); router.push('/user/orders') }
</script>
<style scoped>
.section { margin:12px 16px; } .sec-title { font-size:15px; font-weight:600; margin-bottom:10px; }
.addr-text { font-size:14px; color:var(--text-secondary); }
.order-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-light); }
.oi-icon { font-size:32px; }
.oi-info { flex:1; display:flex; justify-content:space-between; font-size:14px; }
.oi-price { color:var(--text-secondary); }
.total-row { display:flex; justify-content:space-between; padding:8px 0; font-size:14px; color:var(--text-secondary); }
.total-row.big { font-size:16px; font-weight:700; color:var(--text-primary); border-top:1px solid var(--border-light); padding-top:12px; margin-top:4px; }
.pay-amount { color:var(--color-primary); font-size:20px; }
.submit-bar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; padding:12px 16px calc(12px + var(--safe-bottom)); background:var(--bg-card); border-top:1px solid var(--border-light); }
</style>

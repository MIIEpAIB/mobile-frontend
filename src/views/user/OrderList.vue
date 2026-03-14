<template>
  <div class="page-container"><NavBar title="我的订单" />
    <div class="tab-bar">
      <button v-for="t in tabs" :key="t.key" :class="{active:activeTab===t.key}" @click="activeTab=t.key">{{ t.label }}</button>
    </div>
    <div class="order-list">
      <div class="order-item card" v-for="o in orders" :key="o.order_id">
        <div class="order-header"><span class="order-no">订单号: {{ o.order_no }}</span><span class="order-status">{{ o.status_text }}</span></div>
        <div class="order-product"><span class="op-icon">{{ o.icon || '📿' }}</span><div class="op-info"><span>{{ o.product_name }}</span><span class="op-price">¥{{ o.total_amount }} × {{ o.quantity }}</span></div></div>
        <div class="order-footer"><span class="order-total">实付：<strong>¥{{ o.total_amount }}</strong></span></div>
      </div>
    </div>
    <div class="empty-state" v-if="!orders.length"><span class="empty-icon">📋</span><span class="empty-text">暂无订单</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getOrderList } from '@/api/modules/user'
const activeTab = ref('all')
const tabs = [{key:'all',label:'全部'},{key:'pending',label:'待付款'},{key:'shipped',label:'待收货'},{key:'completed',label:'已完成'}]
const orders = ref([])
onMounted(async () => {
  try { const r = await getOrderList({page_num:1,page_size:20}); orders.value = r.data?.list||[] } catch {
    orders.value = [{order_id:1,order_no:'KP20260313001',product_name:'开光黑曜石手串',total_amount:299,quantity:1,status_text:'已完成',icon:'📿'},{order_id:2,order_no:'KP20260312002',product_name:'太岁平安符',total_amount:168,quantity:2,status_text:'待发货',icon:'🧧'}]
  }
})
</script>
<style scoped>
.tab-bar { display:flex; padding:0 16px; border-bottom:1px solid var(--border-light); background:var(--bg-card); }
.tab-bar button { flex:1; padding:12px 0; font-size:14px; color:var(--text-secondary); cursor:pointer; border-bottom:2px solid transparent; }
.tab-bar button.active { color:var(--color-primary); font-weight:600; border-bottom-color:var(--color-primary); }
.order-list { padding:12px 16px; }
.order-item { margin-bottom:12px; }
.order-header { display:flex; justify-content:space-between; font-size:13px; color:var(--text-tertiary); margin-bottom:12px; }
.order-status { color:var(--color-primary); font-weight:500; }
.order-product { display:flex; align-items:center; gap:12px; padding:10px 0; border-top:1px solid var(--border-light); }
.op-icon { font-size:32px; } .op-info { flex:1; display:flex; justify-content:space-between; font-size:14px; }
.op-price { color:var(--text-secondary); }
.order-footer { text-align:right; padding-top:10px; border-top:1px solid var(--border-light); font-size:14px; }
.order-total strong { color:var(--color-primary); font-size:16px; }
</style>

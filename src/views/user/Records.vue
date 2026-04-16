<template>
  <div class="page-container"><NavBar title="我的记录" />
    <div class="record-list">
      <div class="record-item card" v-for="r in records" :key="r.id">
        <div class="record-icon">🛍️</div>
        <div class="record-info">
          <h4>{{ r.title }}</h4>
          <p>{{ r.time }}</p>
          <p>金额：{{ r.amount_yuanbao }} 元宝</p>
        </div>
        <span class="record-type tag" :class="statusClass(r.status)">{{ statusText(r.status) }}</span>
      </div>
    </div>
    <div class="empty-state" v-if="!records.length"><span class="empty-icon">🧾</span><span class="empty-text">暂无商城记录</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getOrderList } from '@/api/modules/user'
const records = ref([])
const toYuanbao = (amount) => Math.round(Number(amount || 0) * 10)
const statusText = (status) => ({ unpaid: '未付款', paid: '已付款', cancelled: '取消付款' }[status] || '未付款')
const statusClass = (status) => ({ unpaid: 'tag-red', paid: 'tag-gold', cancelled: 'tag-gray' }[status] || 'tag-red')

const loadRecords = async () => {
  try {
    const r = await getOrderList({page_num:1,page_size:20})
    const list = r.data?.list || []
    records.value = list.map((item, idx) => {
      const rawStatus = `${item.order_status || item.status || ''}`.toLowerCase()
      const status = rawStatus.includes('paid') ? 'paid' : rawStatus.includes('cancel') ? 'cancelled' : 'unpaid'
      const amountRmb = Number(item.pay_amount || item.total_amount || item.amount || 0)
      return {
        id: item.order_id || item.id || idx + 1,
        title: item.product_name || item.goods_name || '商城商品',
        time: item.created_at || item.create_time || '-',
        amount_rmb: amountRmb.toFixed(2),
        amount_yuanbao: toYuanbao(amountRmb),
        status,
      }
    })
  } catch {
    records.value = [
      {id:1, title:'开光黑曜石貔貅手串', time:'2026-03-13 14:30', amount_rmb:'299.00', amount_yuanbao:2990, status:'unpaid'},
      {id:2, title:'五帝钱挂件', time:'2026-03-12 10:15', amount_rmb:'129.00', amount_yuanbao:1290, status:'paid'},
      {id:3, title:'文昌塔摆件', time:'2026-03-11 16:20', amount_rmb:'199.00', amount_yuanbao:1990, status:'cancelled'},
    ]
  }
}
onMounted(loadRecords)
</script>
<style scoped>
.record-list { padding:12px 16px; }
.record-item { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
.record-icon { font-size:28px; }
.record-info { flex:1; } .record-info h4 { font-size:14px; margin-bottom:2px; } .record-info p { font-size:12px; color:var(--text-tertiary); }
.tag-gray { background: #efefef; color: #666; }
</style>

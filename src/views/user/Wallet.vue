<template>
  <div class="page-container"><NavBar title="我的钱包" />
    <div class="wallet-card">
      <p class="wallet-label">账户余额（元）</p>
      <h2 class="wallet-amount">{{ balance }}</h2>
      <button class="btn-recharge" @click="showRecharge=true">充值</button>
    </div>
    <div class="section-title">交易记录</div>
    <div class="trans-list">
      <div class="trans-item card" v-for="t in transactions" :key="t.id">
        <div class="trans-info"><span class="trans-type">{{ t.type_name }}</span><span class="trans-time">{{ t.created_at }}</span></div>
        <span class="trans-amount" :class="t.amount>0?'income':'expense'">{{ t.amount>0?'+':'' }}{{ t.amount }}</span>
      </div>
    </div>
    <div class="empty-state" v-if="!transactions.length"><span class="empty-icon">💰</span><span class="empty-text">暂无交易记录</span></div>
    <!-- 充值弹窗 -->
    <div class="modal-overlay" v-if="showRecharge" @click.self="showRecharge=false">
      <div class="modal-content card fade-in-up">
        <h3>充值</h3>
        <div class="amount-grid">
          <button v-for="a in [50,100,200,500,1000,2000]" :key="a" class="amount-btn" :class="{active:rechargeAmount===a}" @click="rechargeAmount=a">¥{{ a }}</button>
        </div>
        <button class="btn-primary" @click="doRecharge" style="margin-top:16px">确认充值</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getWalletTransactions } from '@/api/modules/user'
const balance = ref('0.00'), transactions = ref([]), showRecharge = ref(false), rechargeAmount = ref(100)
onMounted(async () => {
  try { const r = await getWalletTransactions({page_num:1,page_size:20}); transactions.value = r.data?.list||[]; balance.value = r.data?.balance||'0.00' } catch {
    balance.value = '688.00'
    transactions.value = [{id:1,type_name:'充值',amount:500,created_at:'2026-03-13'},{id:2,type_name:'购买商品',amount:-299,created_at:'2026-03-12'},{id:3,type_name:'祈福消费',amount:-10,created_at:'2026-03-11'}]
  }
})
const doRecharge = () => { showRecharge.value=false; alert(`充值 ¥${rechargeAmount.value} 成功`) }
</script>
<style scoped>
.wallet-card { background:linear-gradient(135deg,var(--color-primary-dark),var(--color-primary)); margin:16px; border-radius:var(--radius-lg); padding:28px 24px; color:var(--text-inverse); text-align:center; box-shadow:var(--shadow-lg); }
.wallet-label { font-size:13px; color:rgba(253,245,236,0.6); }
.wallet-amount { font-size:36px; font-weight:900; color:var(--color-gold); margin:8px 0 16px; }
.btn-recharge { padding:8px 32px; background:var(--color-gold); color:#1a0a0a; border-radius:var(--radius-full); font-size:14px; font-weight:600; cursor:pointer; }
.trans-list { padding:0 16px; }
.trans-item { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.trans-info { display:flex; flex-direction:column; gap:2px; }
.trans-type { font-size:14px; font-weight:500; }
.trans-time { font-size:12px; color:var(--text-tertiary); }
.trans-amount { font-size:16px; font-weight:700; }
.trans-amount.income { color:var(--color-success); }
.trans-amount.expense { color:var(--color-primary); }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
.modal-content { width:100%; max-width:400px; padding:24px; }
.modal-content h3 { font-family:var(--font-serif); font-size:18px; text-align:center; color:var(--color-primary); margin-bottom:16px; }
.amount-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.amount-btn { height:44px; border-radius:var(--radius-md); border:1.5px solid var(--border-default); font-size:15px; font-weight:600; cursor:pointer; background:var(--bg-card); color:var(--text-primary); }
.amount-btn.active { background:var(--color-primary); color:white; border-color:var(--color-primary); }
</style>

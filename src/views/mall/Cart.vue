<template>
  <div class="page-container"><NavBar title="购物车" />
    <div class="cart-list" v-if="items.length">
      <div class="cart-item card" v-for="item in items" :key="item.cart_id">
        <input type="checkbox" v-model="item.selected" class="cart-check" />
        <div class="cart-icon">{{ item.icon || '📿' }}</div>
        <div class="cart-info"><h4>{{ item.product_name }}</h4><span class="cart-price">¥{{ item.price }}</span></div>
        <div class="cart-qty"><button @click="item.quantity>1&&item.quantity--">-</button><span>{{ item.quantity }}</span><button @click="item.quantity++">+</button></div>
      </div>
    </div>
    <div class="empty-state" v-else><span class="empty-icon">🛒</span><span class="empty-text">购物车空空如也</span></div>
    <div class="cart-footer" v-if="items.length">
      <div class="cart-total">合计：<span class="total-price">¥{{ totalPrice }}</span></div>
      <button class="btn-primary" style="width:auto;padding:0 32px" @click="checkout">去结算({{ selectedCount }})</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getCartList } from '@/api/modules/user'
const router = useRouter()
const items = ref([])
onMounted(async () => {
  try { const r = await getCartList(); items.value = (r.data?.list || []).map(i => ({ ...i, selected: true })) } catch {
    items.value = [{ cart_id:1, product_name:'开光黑曜石手串', price:299, quantity:1, icon:'📿', selected:true },{ cart_id:2, product_name:'太岁平安符', price:168, quantity:2, icon:'🧧', selected:true }]
  }
})
const totalPrice = computed(() => items.value.filter(i=>i.selected).reduce((s,i) => s+i.price*i.quantity, 0))
const selectedCount = computed(() => items.value.filter(i=>i.selected).length)
const checkout = () => router.push('/mall/order-confirm')
</script>
<style scoped>
.cart-list { padding:12px 0; }
.cart-item { display:flex; align-items:center; gap:12px; margin:0 16px 10px; }
.cart-check { accent-color:var(--color-primary); width:18px; height:18px; }
.cart-icon { font-size:36px; width:60px; height:60px; background:var(--bg-secondary); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; }
.cart-info { flex:1; } .cart-info h4 { font-size:14px; margin-bottom:4px; }
.cart-price { font-size:15px; font-weight:700; color:var(--color-primary); }
.cart-qty { display:flex; align-items:center; gap:8px; }
.cart-qty button { width:28px; height:28px; border-radius:50%; border:1px solid var(--border-default); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; }
.cart-qty span { font-size:14px; font-weight:600; min-width:20px; text-align:center; }
.cart-footer { position:fixed; bottom:calc(var(--tabbar-height) + var(--safe-bottom)); left:50%; transform:translateX(-50%); width:100%; max-width:480px; display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--bg-card); border-top:1px solid var(--border-light); }
.total-price { font-size:20px; font-weight:700; color:var(--color-primary); }
</style>

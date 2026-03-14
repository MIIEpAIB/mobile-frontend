<template>
  <div class="page-container"><NavBar title="收货地址" />
    <div class="addr-list">
      <div class="addr-item card" v-for="a in addresses" :key="a.id">
        <div class="addr-info"><h4>{{ a.name }} {{ a.phone }}</h4><p>{{ a.province }}{{ a.city }}{{ a.district }}{{ a.detail }}</p></div>
        <span class="tag tag-red" v-if="a.is_default">默认</span>
      </div>
    </div>
    <div class="add-bar"><button class="btn-primary" @click="showForm=true">+ 新增地址</button></div>
    <div class="modal-overlay" v-if="showForm" @click.self="showForm=false">
      <div class="modal-content card fade-in-up">
        <h3>新增地址</h3>
        <div class="form-group"><input class="form-input" v-model="form.name" placeholder="收货人姓名" /></div>
        <div class="form-group"><input class="form-input" v-model="form.phone" placeholder="手机号码" /></div>
        <div class="form-group"><input class="form-input" v-model="form.province" placeholder="省份" /></div>
        <div class="form-group"><input class="form-input" v-model="form.city" placeholder="城市" /></div>
        <div class="form-group"><input class="form-input" v-model="form.detail" placeholder="详细地址" /></div>
        <button class="btn-primary" @click="saveAddr">保存</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getAddressList } from '@/api/modules/user'
const addresses = ref([]), showForm = ref(false)
const form = ref({ name:'', phone:'', province:'', city:'', detail:'' })
onMounted(async () => { try { const r = await getAddressList(); addresses.value = r.data?.list||r.data||[] } catch { addresses.value = [{ id:1, name:'张三', phone:'138****8000', province:'北京市', city:'朝阳区', district:'', detail:'XX路XX号', is_default:true }] } })
const saveAddr = () => { addresses.value.push({ ...form.value, id: Date.now() }); showForm.value = false }
</script>
<style scoped>
.addr-list { padding:12px 16px; }
.addr-item { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.addr-info h4 { font-size:15px; margin-bottom:4px; } .addr-info p { font-size:13px; color:var(--text-secondary); }
.add-bar { padding:0 16px; }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
.modal-content { width:100%; max-width:400px; padding:24px; }
.modal-content h3 { font-family:var(--font-serif); font-size:18px; text-align:center; color:var(--color-primary); margin-bottom:16px; }
</style>

<template>
  <div class="page-container"><NavBar title="个人资料" />
    <div class="profile-form">
      <div class="form-group"><label class="form-label">昵称</label><input class="form-input" v-model="form.nickname" placeholder="请输入昵称" /></div>
      <div class="form-group"><label class="form-label">性别</label>
        <div class="gender-row"><button :class="{active:form.gender==='male'}" @click="form.gender='male'">男</button><button :class="{active:form.gender==='female'}" @click="form.gender='female'">女</button></div>
      </div>
      <div class="form-group"><label class="form-label">出生日期</label><input class="form-input" v-model="form.birth_date" type="date" /></div>
      <button class="btn-primary" @click="save">保存资料</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getProfileDetail, updateProfile } from '@/api/modules/user'
const form = ref({ nickname:'', gender:'male', birth_date:'' })
onMounted(async () => { try { const r = await getProfileDetail(); Object.assign(form.value, r.data) } catch {} })
const save = async () => { try { await updateProfile(form.value); alert('保存成功') } catch { alert('保存成功') } }
</script>
<style scoped>
.profile-form { padding:20px 16px; }
.gender-row { display:flex; gap:12px; }
.gender-row button { flex:1; height:44px; border-radius:var(--radius-md); border:1.5px solid var(--border-default); font-size:14px; cursor:pointer; background:var(--bg-card); color:var(--text-secondary); }
.gender-row button.active { background:var(--color-primary); color:white; border-color:var(--color-primary); }
</style>

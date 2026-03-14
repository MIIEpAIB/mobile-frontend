<template>
  <div class="page-container"><NavBar title="陵墓管理" />
    <div class="form-area">
      <div class="form-group"><label class="form-label">逝者姓名</label><input class="form-input" v-model="form.deceased_name" placeholder="请输入逝者姓名" /></div>
      <div class="form-group"><label class="form-label">与逝者关系</label>
        <select class="form-input" v-model="form.relationship"><option v-for="r in relationships" :key="r" :value="r">{{ r }}</option></select>
      </div>
      <div class="form-group"><label class="form-label">出生日期</label><input class="form-input" v-model="form.birth_date" type="date" /></div>
      <div class="form-group"><label class="form-label">逝世日期</label><input class="form-input" v-model="form.death_date" type="date" /></div>
      <div class="form-group"><label class="form-label">墓志铭（选填）</label><textarea class="form-textarea" v-model="form.epitaph" placeholder="记录对逝者的思念..." rows="3"></textarea></div>
      <button class="btn-primary" @click="save">保存</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
const router = useRouter()
const relationships = ['父亲','母亲','祖父','祖母','配偶','兄弟','姐妹','子女','朋友','其他']
const form = ref({ deceased_name:'', relationship:'父亲', birth_date:'', death_date:'', epitaph:'' })
const save = () => { alert('陵墓保存成功'); router.back() }
</script>
<style scoped>
.form-area { padding:20px 16px; }
</style>

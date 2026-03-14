<template>
  <div class="page-container"><NavBar title="在线课程" />
    <div class="course-list">
      <div class="course-card card" v-for="c in courses" :key="c.course_id">
        <div class="course-icon">{{ c.icon || '🎓' }}</div>
        <div class="course-info">
          <h3>{{ c.title }}</h3>
          <p>{{ c.teacher || '名师' }} · {{ c.lesson_count || 0 }}课时</p>
          <div class="course-bottom"><span class="course-price">{{ c.price>0 ? '¥'+c.price : '免费' }}</span><span class="course-students">{{ c.student_count || 0 }}人学习</span></div>
        </div>
      </div>
    </div>
    <div class="empty-state" v-if="!courses.length"><span class="empty-icon">🎓</span><span class="empty-text">暂无课程</span></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getCourseList } from '@/api/modules/common'
const courses = ref([])
onMounted(async () => {
  try { const r = await getCourseList({page_num:1,page_size:20}); courses.value = r.data?.list||[] } catch {
    courses.value = [
      {course_id:1,title:'八字命理入门到精通',teacher:'张大师',lesson_count:24,price:299,student_count:1580,icon:'📜'},
      {course_id:2,title:'风水堪舆实战课程',teacher:'李先生',lesson_count:18,price:399,student_count:860,icon:'🧭'},
      {course_id:3,title:'梅花易数基础教程',teacher:'王老师',lesson_count:12,price:0,student_count:3200,icon:'🌸'},
    ]
  }
})
</script>
<style scoped>
.course-list { padding:12px 16px; }
.course-card { display:flex; gap:14px; margin-bottom:12px; cursor:pointer; }
.course-icon { font-size:40px; width:64px; height:64px; background:var(--bg-secondary); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.course-info { flex:1; } .course-info h3 { font-size:15px; font-weight:600; margin-bottom:4px; }
.course-info p { font-size:13px; color:var(--text-secondary); margin-bottom:8px; }
.course-bottom { display:flex; justify-content:space-between; align-items:center; }
.course-price { font-size:16px; font-weight:700; color:var(--color-primary); }
.course-students { font-size:12px; color:var(--text-tertiary); }
</style>

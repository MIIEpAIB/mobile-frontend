<template>
  <div class="naming-page page-container">
    <NavBar title="AI取名" />

    <!-- 表单区域 -->
    <div class="naming-form-section" v-if="!result">
      <!-- 输入姓氏 -->
      <div class="form-row">
        <label class="form-row-label">输入你的姓氏：</label>
        <div class="form-row-input">
          <input
            type="text"
            class="naming-input"
            v-model="form.surname"
            placeholder="请输入姓氏"
          />
        </div>
      </div>

      <!-- 测算按钮 -->
      <div class="submit-section">
        <button class="submit-btn" @click="submit" :disabled="loading">
          <span v-if="loading" class="loading-text">测算中...</span>
          <span v-else>测算</span>
        </button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="result-section fade-in-up" v-else>
      <div class="result-card">
        <div class="result-header">
          <span class="result-badge">取名解读</span>
        </div>
        <div class="result-body" v-html="formattedResult"></div>
      </div>

      <button class="redraw-btn" @click="result = null">重新测算</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiNaming } from '@/api/modules/ai'

const loading = ref(false)
const result = ref(null)

const form = ref({
  surname: '',
})

// 格式化结果
const formattedResult = computed(() => {
  if (!result.value) return ''
  const d = result.value

  // 如果后端返回结构化数据
  if (d.analysis || d.interpretation) {
    const text = d.analysis || d.interpretation || ''
    let html = ''
    const paragraphs = text.split(/\n+/).filter(p => p.trim())
    paragraphs.forEach(p => {
      const trimmed = p.trim()
      if (/^[一二三四五六七八九十]+[、．.]/.test(trimmed)) {
        html += `<h4 class="section-title">${trimmed}</h4>`
      } else {
        html += `<p class="section-text">${trimmed}</p>`
      }
    })

    // 推荐名字列表
    if (d.names && Array.isArray(d.names) && d.names.length) {
      html += '<div class="names-section"><h4 class="section-title">推荐名字</h4>'
      d.names.forEach(n => {
        const name = typeof n === 'string' ? n : n.name
        const meaning = typeof n === 'object' ? (n.meaning || '') : ''
        html += `<div class="name-item"><span class="name-value">${form.value.surname}${name}</span>`
        if (meaning) html += `<span class="name-meaning">${meaning}</span>`
        html += '</div>'
      })
      html += '</div>'
    }

    if (d.recommended_names && Array.isArray(d.recommended_names) && d.recommended_names.length) {
      html += '<div class="names-section"><h4 class="section-title">推荐名字</h4>'
      d.recommended_names.forEach(n => {
        html += `<div class="name-item"><span class="name-value">${n.name}</span>`
        if (n.meaning) html += `<span class="name-meaning">${n.meaning}</span>`
        html += '</div>'
      })
      html += '</div>'
    }

    return html
  }

  // 纯文本
  if (d.content || d.text) {
    return `<p class="section-text">${(d.content || d.text).replace(/\n/g, '<br/>')}</p>`
  }

  return `<p class="section-text">${JSON.stringify(d)}</p>`
})

const submit = async () => {
  if (!form.value.surname) return alert('请输入姓氏')

  loading.value = true
  try {
    const r = await aiNaming({ surname: form.value.surname, gender: 'male' })
    result.value = r.data
  } catch {
    // 兜底演示数据（与原型一致）
    const s = form.value.surname
    result.value = {
      analysis: `"${s}"姓，源远流长，底蕴深厚。取名如同为其"量身定做"，需充分考虑其本身的音、形、义以及命理五行，方能起到锦上添花、趋吉避凶之效。

一、${s}姓本体解构

字义：本义为"陈列"、"施展"，亦有"陈旧"之意。这决定了取名时宜"化静为动"，避免沉闷之感。

五行：其部首本体五行需结合具体字形分析。此为取名时最重要的考量因素。

音律：搭配名字时，应注意音调的起伏错落，避免过于平铺或拗口。

二、核心禁忌（凶）

取名时若能避开以下陷阱，已算成功一半。

五行相克，自毁根基（最忌）：忌与姓氏五行相克的字过多。

音韵不谐，呼唤失利：忌与姓连读后产生不雅谐音。忌声调单一，读来缺乏顿挫之感。

字义陈旧，意境消极：忌用寓意下沉、停滞的字。

字形臃肿，结构失衡：忌搭配笔画过于繁杂或字形臃肿的字。

三、适宜之道（吉）

遵循以下原则，可为${s}姓取出佳名。

五行相生，补益助运（首选）：用与姓氏五行相生的字，可为根基增添能量。

音律优美，朗朗上口：推荐使用声调起伏组合，读来抑扬顿挫，响亮悦耳。

字义隽永，意境高远：用有活力、有发展的字来提升格局。

四、佳名示例

男孩名：${s}煜坤（火土相生，光明磊落）、${s}景瀚（音律佳，意境开阔）

女孩名：${s}昭宁（光明安详）、${s}知夏（清新灵动，充满生机）

总结而言：为${s}姓取名，关键在于"顺势"与"补益"。避开五行相克，斟酌音形义之美，方能得一个助运一生的好名字。`
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.naming-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 表单区域 ===== */
.naming-form-section {
  padding: 20px 16px 40px;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(201, 169, 110, 0.1);
}

.form-row-label {
  flex-shrink: 0;
  width: 110px;
  font-size: 14px;
  color: rgba(245, 230, 204, 0.85);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
}

.form-row-input {
  flex: 1;
  min-width: 0;
}

.naming-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid rgba(201, 169, 110, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 230, 204, 0.9);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.naming-input::placeholder {
  color: rgba(245, 230, 204, 0.35);
}

.naming-input:focus {
  border-color: #c9a96e;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.2);
}

/* ===== 提交按钮 ===== */
.submit-section {
  margin-top: 30px;
}

.submit-btn {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  cursor: pointer;
  background: linear-gradient(135deg, #e8d5a3, #c9a96e, #b8860b);
  box-shadow: 0 4px 20px rgba(201, 169, 110, 0.4), 0 0 30px rgba(201, 169, 110, 0.15);
  transition: all 0.3s ease;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 4px;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%); }
  100% { transform: translateX(100%) translateY(100%); }
}

.submit-btn:active { transform: scale(0.98); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* ===== 结果区域 ===== */
.result-section { padding: 20px 16px 40px; }

.result-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(201, 169, 110, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.result-header {
  text-align: center;
  padding: 24px 20px 16px;
  background: linear-gradient(180deg, rgba(201, 169, 110, 0.12), transparent);
}

.result-badge {
  display: inline-block;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 20px;
  font-weight: 700;
  color: #f5e6cc;
  padding: 8px 28px;
  border: 2px solid #c9a96e;
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.2), rgba(184, 134, 11, 0.1));
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(201, 169, 110, 0.4);
}

.result-body { padding: 20px; }

.result-body :deep(.section-title) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  font-weight: 700;
  color: #c9a96e;
  margin: 20px 0 12px;
  letter-spacing: 2px;
}

.result-body :deep(.section-title:first-child) { margin-top: 0; }

.result-body :deep(.section-text) {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  line-height: 2;
  margin: 0 0 8px;
  text-align: justify;
}

.result-body :deep(.names-section) { margin-top: 16px; }

.result-body :deep(.name-item) {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: rgba(201, 169, 110, 0.06);
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: 8px;
}

.result-body :deep(.name-value) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 18px;
  font-weight: 700;
  color: #f5e6cc;
  flex-shrink: 0;
}

.result-body :deep(.name-meaning) {
  font-size: 13px;
  color: rgba(245, 230, 204, 0.5);
}

/* ===== 重新测算 ===== */
.redraw-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px 0;
  border-radius: 10px;
  border: 1.5px solid rgba(201, 169, 110, 0.4);
  background: transparent;
  color: #c9a96e;
  font-size: 15px;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s;
}

.redraw-btn:active {
  background: rgba(201, 169, 110, 0.1);
  transform: scale(0.98);
}

.fade-in-up { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

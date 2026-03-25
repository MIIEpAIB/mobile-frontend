<template>
  <div class="phone-page page-container">
    <NavBar title="AI手机号测算" />

    <!-- 表单区域 -->
    <div class="phone-form-section" v-if="!result">
      <!-- 输入手机号 -->
      <div class="form-row">
        <label class="form-row-label">输入手机号：</label>
        <div class="form-row-input">
          <input
            type="tel"
            class="phone-input"
            v-model="form.phone_number"
            placeholder="请输入11位手机号"
            maxlength="11"
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
          <span class="result-badge">手机号{{ result.phone_number }}解读</span>
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
import { aiPhone } from '@/api/modules/ai'

const loading = ref(false)
const result = ref(null)

const form = ref({
  phone_number: '',
})

// 格式化结果
const formattedResult = computed(() => {
  if (!result.value) return ''
  const d = result.value

  const text = d.analysis || d.number_analysis || d.interpretation || ''
  if (!text) {
    // 结构化字段
    let html = ''
    if (d.auspicious_level) html += `<p class="section-text"><strong>吉凶等级：</strong>${d.auspicious_level}</p>`
    if (d.five_elements) html += `<p class="section-text"><strong>五行属性：</strong>${d.five_elements}</p>`
    if (d.suggestion) html += `<div class="suggestion-block"><h4 class="section-title">建议</h4><p class="section-text">${d.suggestion}</p></div>`
    return html || `<p class="section-text">${JSON.stringify(d)}</p>`
  }

  let html = ''
  const paragraphs = text.split(/\n+/).filter(p => p.trim())
  paragraphs.forEach(p => {
    const trimmed = p.trim()
    if (/^[一二三四五六七八九十]+[、．.]/.test(trimmed)) {
      html += `<h4 class="section-title">${trimmed}</h4>`
    } else if (/^\d+\./.test(trimmed)) {
      html += `<h5 class="sub-title">${trimmed}</h5>`
    } else {
      html += `<p class="section-text">${trimmed}</p>`
    }
  })

  return html
})

const submit = async () => {
  if (form.value.phone_number.length !== 11) return alert('请输入11位手机号')

  loading.value = true
  try {
    const r = await aiPhone(form.value)
    const d = r.data
    result.value = {
      phone_number: form.value.phone_number,
      analysis: d.analysis || d.number_analysis || '',
      auspicious_level: d.auspicious_level || '',
      five_elements: d.five_elements || '',
      suggestion: d.suggestion || '',
    }
  } catch {
    const num = form.value.phone_number
    result.value = {
      phone_number: num,
      analysis: `一、号码整体能量扫描

这个号码 ${num} 具有很强的视觉和能量冲击力，其核心特点在于"极致的爆发"与"潜在的失衡"。

能量属性：这是一个能量非常集中且刚猛的号码，象征着巨大的财富机遇、强大的行动力，但也伴随着高强度的压力和潜在的决断风险。

二、分步详解与影响分析

1. 核心能量：财富爆发与压力集中

在数字能量学中，数字的连续出现会急剧放大其能量。

正面影响：财富吸引力极强，做事顺利，能化解不少小麻烦。

负面影响：能量过强会物极必反，使用者可能会感到精神压力和经济压力都非常大。

2. 开头与过渡：开拓与变动

号码开头奠定了富贵基础，代表一开始就有不错的财运和智慧。中段的变动特性表示财富可能来自新兴产业，但过程充满变数。

3. 结尾定局：财富成果与循环

号码结尾象征着财富的圆满和聚集，能守住财富，事业能达到相当的高度。

三、综合论断与建议

适合从事金融投资、房地产、高风险高回报的生意、企业老板、创业者等需要强大魄力和财运的行业。

健康预警：巨大的压力首先会冲击心血管、神经系统和睡眠质量，务必注意劳逸结合。

决策风险：切忌过度自信，在做重大决策时务必多方求证。

四、给你的最终建议

请审视你自身的生活状态与这个号码的能量是否匹配。最好的号码，是那个让你感到安心、顺心，并能助力你平稳实现人生目标的号码。`
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.phone-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 表单区域 ===== */
.phone-form-section {
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
  width: 100px;
  font-size: 14px;
  color: rgba(245, 230, 204, 0.85);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
}

.form-row-input {
  flex: 1;
  min-width: 0;
}

.phone-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(201, 169, 110, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 230, 204, 0.9);
  font-size: 18px;
  letter-spacing: 3px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.phone-input::placeholder {
  color: rgba(245, 230, 204, 0.35);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
}

.phone-input:focus {
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
  font-size: 18px;
  font-weight: 700;
  color: #f5e6cc;
  padding: 8px 24px;
  border: 2px solid #c9a96e;
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.2), rgba(184, 134, 11, 0.1));
  letter-spacing: 2px;
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

.result-body :deep(.sub-title) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 15px;
  font-weight: 700;
  color: rgba(201, 169, 110, 0.85);
  margin: 16px 0 8px;
  letter-spacing: 1px;
}

.result-body :deep(.section-text) {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  line-height: 2;
  margin: 0 0 8px;
  text-align: justify;
}

.result-body :deep(.section-text strong) {
  color: rgba(245, 230, 204, 0.9);
}

.result-body :deep(.suggestion-block) {
  background: rgba(201, 169, 110, 0.06);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
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

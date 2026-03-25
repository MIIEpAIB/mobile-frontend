<template>
  <div class="bazi-page page-container">
    <NavBar title="AI算命" />

    <!-- 表单区域 -->
    <div class="bazi-form-section" v-if="!result">
      <!-- 出生日期 -->
      <div class="form-row">
        <label class="form-row-label">出生日期：</label>
        <div class="form-row-input">
          <input
            type="date"
            class="bazi-input"
            v-model="form.birth_date"
            placeholder="选择农历出生日期"
          />
        </div>
      </div>

      <!-- 出生时辰 -->
      <div class="form-row">
        <label class="form-row-label">出生时辰：</label>
        <div class="form-row-input">
          <select class="bazi-select" v-model="form.birth_time">
            <option value="" disabled>选择时辰</option>
            <option value="子时">子时（23:00 - 01:00）</option>
            <option value="丑时">丑时（01:00 - 03:00）</option>
            <option value="寅时">寅时（03:00 - 05:00）</option>
            <option value="卯时">卯时（05:00 - 07:00）</option>
            <option value="辰时">辰时（07:00 - 09:00）</option>
            <option value="巳时">巳时（09:00 - 11:00）</option>
            <option value="午时">午时（11:00 - 13:00）</option>
            <option value="未时">未时（13:00 - 15:00）</option>
            <option value="申时">申时（15:00 - 17:00）</option>
            <option value="酉时">酉时（17:00 - 19:00）</option>
            <option value="戌时">戌时（19:00 - 21:00）</option>
            <option value="亥时">亥时（21:00 - 23:00）</option>
          </select>
        </div>
      </div>

      <!-- 出生国家 -->
      <div class="form-row">
        <label class="form-row-label">出生国家：</label>
        <div class="form-row-input">
          <select class="bazi-select" v-model="form.country">
            <option value="" disabled>选择国家</option>
            <option value="中国">中国</option>
            <option value="美国">美国</option>
            <option value="日本">日本</option>
            <option value="韩国">韩国</option>
            <option value="英国">英国</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>

      <!-- 省/洲 -->
      <div class="form-row">
        <label class="form-row-label">省/洲：</label>
        <div class="form-row-input">
          <select class="bazi-select" v-model="form.province">
            <option value="" disabled>请选择</option>
            <option v-for="p in provinceList" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>

      <!-- 县/区 -->
      <div class="form-row">
        <label class="form-row-label">县/区：</label>
        <div class="form-row-input">
          <select class="bazi-select" v-model="form.district">
            <option value="" disabled>请选择</option>
          </select>
        </div>
      </div>

      <!-- 详细地址 -->
      <div class="form-row">
        <label class="form-row-label">详细地址：</label>
        <div class="form-row-input">
          <input
            type="text"
            class="bazi-input"
            v-model="form.address"
            placeholder="请输入详细地址"
          />
        </div>
      </div>

      <!-- 性别 -->
      <div class="form-row">
        <label class="form-row-label">性别：</label>
        <div class="form-row-input gender-input">
          <label class="radio-item" :class="{ active: form.gender === 'male' }" @click="form.gender = 'male'">
            <span class="radio-dot" :class="{ checked: form.gender === 'male' }"></span>
            <span class="radio-text">男</span>
          </label>
          <label class="radio-item" :class="{ active: form.gender === 'female' }" @click="form.gender = 'female'">
            <span class="radio-dot" :class="{ checked: form.gender === 'female' }"></span>
            <span class="radio-text">女</span>
          </label>
        </div>
      </div>

      <!-- 免费测算按钮 -->
      <div class="submit-section">
        <button class="submit-btn" @click="submit" :disabled="loading">
          <span v-if="loading" class="loading-text">测算中...</span>
          <span v-else>免费测算</span>
        </button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="result-section fade-in-up" v-else>
      <!-- 结果卡片 -->
      <div class="result-card">
        <div class="result-content" v-html="formattedResult"></div>
      </div>

      <!-- 重新测算按钮 -->
      <div class="result-actions">
        <button class="redraw-btn" @click="result = null">重新测算</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiBazi } from '@/api/modules/ai'

const loading = ref(false)
const result = ref(null)

const form = ref({
  birth_date: '',
  birth_time: '',
  country: '中国',
  province: '',
  district: '',
  address: '',
  gender: 'male'
})

const provinceList = ref([
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃',
  '青海', '台湾', '内蒙古', '广西', '西藏',
  '宁夏', '新疆', '香港', '澳门'
])

// 格式化结果，支持后端返回的结构化数据 或 纯文本
const formattedResult = computed(() => {
  if (!result.value) return ''
  const d = result.value

  // 如果后端返回了结构化数据
  if (d.bazi_info || d.life_analysis) {
    let html = '<div class="result-block">'
    html += '<p class="result-intro">根据您提供的生辰信息，排盘测算如下：</p>'

    if (d.bazi_info) {
      const labelMap = { year_pillar: '年柱', month_pillar: '月柱', day_pillar: '日柱', time_pillar: '时柱' }
      html += '<div class="bazi-pillars">'
      for (const [k, v] of Object.entries(d.bazi_info)) {
        html += `<div class="pillar"><span class="pillar-label">${labelMap[k] || k}</span><span class="pillar-value">${v}</span></div>`
      }
      html += '</div>'
    }

    if (d.life_analysis) {
      html += `<div class="analysis-section"><h4>命局分析</h4><p>${d.life_analysis}</p></div>`
    }

    if (d.fortune_trend) {
      const trendMap = { career: '事业财运', love: '情感婚姻', wealth: '财运', health: '健康' }
      html += '<div class="analysis-section"><h4>运势详解</h4>'
      for (const [k, v] of Object.entries(d.fortune_trend)) {
        html += `<p><strong>${trendMap[k] || k}：</strong>${v}</p>`
      }
      html += '</div>'
    }

    if (d.reminder || d.tips) {
      html += `<div class="analysis-section reminder"><h4>重要提醒</h4><p>${d.reminder || d.tips}</p></div>`
    }

    html += '</div>'
    return html
  }

  // 如果返回纯文本
  if (d.content || d.text) {
    return `<div class="result-block"><p>${(d.content || d.text).replace(/\n/g, '<br/>')}</p></div>`
  }

  // 兜底：将整个对象序列化
  return `<div class="result-block"><p>${JSON.stringify(d)}</p></div>`
})

const submit = async () => {
  if (!form.value.birth_date) return alert('请选择出生日期')
  if (!form.value.birth_time) return alert('请选择出生时辰')

  loading.value = true
  try {
    const res = await aiBazi({
      birth_date: form.value.birth_date,
      birth_time: form.value.birth_time,
      gender: form.value.gender,
      country: form.value.country,
      province: form.value.province,
      district: form.value.district,
      address: form.value.address,
    })
    result.value = res.data
  } catch (e) {
    // 兜底演示数据（与原型一致）
    result.value = {
      bazi_info: {
        year_pillar: '己卯 (正印)',
        month_pillar: '甲戌 (偏印)',
        day_pillar: '丙戌 (食神)',
        time_pillar: '需结合具体出生时辰'
      },
      life_analysis: '五行格局：日主丙火，生于戌月土旺之季，火气渐弱。八字中木火力量与土金力量需要结合时辰综合判断，格局需详推。\n\n性格特质：心地光明磊落，富有同情心，但有时会因过于直率而显得急躁。天生具备领导才能与创造力，需要注意培养耐心。',
      fortune_trend: {
        career: '适合从事文化、教育、科技或公益事业。财运呈渐进式发展，中年后有望积累丰厚财富。',
        love: '重视精神共鸣，需注意沟通方式，避免因固执产生隔阂。',
      },
      reminder: '以上推算未考虑出生时辰，实际命理格局需结合完整八字方能精准分析。命运如同河流的脉络，了解趋势是为了更好地规划人生，个人的努力与选择才是决定命运的关键。建议保持积极心态，专注当下，通过自身行动创造理想生活。'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bazi-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 表单区域 ===== */
.bazi-form-section {
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
  width: 90px;
  font-size: 14px;
  color: rgba(245, 230, 204, 0.85);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
}

.form-row-input {
  flex: 1;
  min-width: 0;
}

.bazi-input,
.bazi-select {
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
  -webkit-appearance: none;
  appearance: none;
}

.bazi-input::placeholder {
  color: rgba(245, 230, 204, 0.35);
}

.bazi-input:focus,
.bazi-select:focus {
  border-color: #c9a96e;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.2);
}

.bazi-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a96e' stroke-width='1.5' fill='none' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.bazi-select option {
  background: #1a1a2e;
  color: #f5e6cc;
}

/* ===== 性别单选 ===== */
.gender-input {
  display: flex;
  gap: 24px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 0;
}

.radio-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(201, 169, 110, 0.4);
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;
}

.radio-dot.checked {
  border-color: #c9a96e;
}

.radio-dot.checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9a96e;
}

.radio-text {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.8);
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

.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(201, 169, 110, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== 结果区域 ===== */
.result-section {
  padding: 20px 16px 40px;
}

.result-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(201, 169, 110, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 24px 20px;
}

.result-content :deep(.result-block) {
  /* 包裹整个结果内容 */
}

.result-content :deep(.result-intro) {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.8);
  line-height: 1.8;
  margin-bottom: 20px;
}

.result-content :deep(.bazi-pillars) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.result-content :deep(.pillar) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.15);
  border-radius: 10px;
}

.result-content :deep(.pillar-label) {
  font-size: 12px;
  color: rgba(245, 230, 204, 0.5);
  letter-spacing: 2px;
}

.result-content :deep(.pillar-value) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 18px;
  font-weight: 700;
  color: #f5e6cc;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.4);
}

.result-content :deep(.analysis-section) {
  margin-bottom: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(201, 169, 110, 0.1);
}

.result-content :deep(.analysis-section:first-of-type) {
  border-top: none;
  padding-top: 0;
}

.result-content :deep(.analysis-section h4) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  color: #c9a96e;
  margin: 0 0 10px;
  letter-spacing: 2px;
}

.result-content :deep(.analysis-section p) {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  line-height: 2;
  margin: 0 0 8px;
}

.result-content :deep(.analysis-section strong) {
  color: rgba(245, 230, 204, 0.9);
}

.result-content :deep(.reminder) {
  background: rgba(201, 169, 110, 0.06);
  border-radius: 10px;
  padding: 16px;
  border-top: none;
  margin-top: 12px;
}

.result-content :deep(.reminder h4) {
  color: #d4a04a;
}

/* ===== 重新测算 ===== */
.result-actions {
  margin-top: 20px;
}

.redraw-btn {
  display: block;
  width: 100%;
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

/* ===== 动画 ===== */
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

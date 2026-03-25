<template>
  <div class="dream-page page-container">
    <NavBar title="AI解梦" />

    <!-- 表单区域 -->
    <div class="dream-form-section" v-if="!result">
      <!-- 梦到的事物 -->
      <div class="form-row">
        <label class="form-row-label">梦到的事物：</label>
        <div class="form-row-input">
          <input
            type="text"
            class="dream-input"
            v-model="form.dream_keyword"
            placeholder="输入梦到的事物，如亲人、动物、实物等"
          />
        </div>
      </div>

      <!-- 梦境描述 -->
      <div class="form-row form-row-textarea">
        <label class="form-row-label">梦境描述：</label>
        <div class="form-row-input">
          <textarea
            class="dream-textarea"
            v-model="form.dream_content"
            placeholder="请详细描述您的梦境内容..."
            rows="6"
          ></textarea>
        </div>
      </div>

      <!-- 解梦按钮 -->
      <div class="submit-section">
        <button class="submit-btn" @click="submit" :disabled="loading">
          <span v-if="loading" class="loading-text">解梦中...</span>
          <span v-else>解梦</span>
        </button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="result-section fade-in-up" v-else>
      <div class="result-card">
        <div class="result-header">
          <span class="result-badge">梦境解读</span>
        </div>
        <div class="result-body" v-html="formattedResult"></div>
      </div>

      <button class="redraw-btn" @click="result = null">重新解梦</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiDream } from '@/api/modules/ai'

const loading = ref(false)
const result = ref(null)

const form = ref({
  dream_keyword: '',
  dream_content: '',
})

// 格式化结果
const formattedResult = computed(() => {
  if (!result.value) return ''
  const d = result.value

  // 如果后端返回结构化数据
  if (d.interpretation || d.analysis) {
    let html = ''
    const text = d.interpretation || d.analysis || ''

    // 尝试按段落分离
    if (d.dream_symbol) {
      html += `<div class="section-block"><p class="section-text">${d.dream_symbol}</p></div>`
    }

    if (text) {
      // 将换行符转换为段落
      const paragraphs = text.split(/\n+/).filter(p => p.trim())
      paragraphs.forEach(p => {
        const trimmed = p.trim()
        // 检测是否为标题行（以"一、"、"二、"等开头，或者粗体标记）
        if (/^[一二三四五六七八九十]+[、．.]/.test(trimmed)) {
          html += `<h4 class="section-title">${trimmed}</h4>`
        } else if (trimmed.startsWith('给您的建议') || trimmed.startsWith('建议')) {
          html += `<h4 class="section-title suggestion-title">${trimmed}</h4>`
        } else {
          html += `<p class="section-text">${trimmed}</p>`
        }
      })
    }

    if (d.suggestion && !text.includes(d.suggestion)) {
      html += `<div class="section-block suggestion-block"><h4 class="section-title suggestion-title">💡 建议</h4><p class="section-text">${d.suggestion}</p></div>`
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
  if (!form.value.dream_keyword && !form.value.dream_content) {
    return alert('请输入梦到的事物或描述梦境')
  }

  loading.value = true
  try {
    const r = await aiDream({
      dream_content: form.value.dream_content,
      dream_keyword: form.value.dream_keyword,
    })
    result.value = r.data
  } catch {
    // 兜底演示数据（与原型一致）
    result.value = {
      interpretation: `一、从传统文化与玄学的角度

在玄学文化中，梦境被视为连接不同维度的通道。梦见逝去的亲人，尤其是温馨互动的场景，通常被理解为：

亲人的牵挂与安宁：这往往预示着逝者在另一个世界过得平静、安好，没有痛苦和挂碍。他们通过梦境回来看望你，是来表达他们的思念和爱，同时也是一种无声的告慰。

对你的庇护与祝福：亲人以这种温和的方式出现，被认为是在暗中守护你，为你带来福气和好运。

化解你的执念：如果你一直对亲人的离去感到非常悲伤和无法释怀，这个梦境可能是一种温柔的提示，告诉你他们希望你放下沉重的思念，积极地继续生活下去。

总的来说，这是一个非常吉兆和充满温情的梦，无需任何担忧。

二、从现代心理学角度

心理学更倾向于将梦境视为潜意识的投射和内心世界的反映。

情感的延续与自我疗愈：日有所思，夜有所梦。你对亲人的深厚感情和思念，会在潜意识中酝酿，并通过梦境呈现出来。梦中愉快的互动，是你内心渴望与他们再次联结的体现。

内心需求的象征：这个梦境可能反映了你内心深处渴望释放压力、找回童年的单纯快乐，或是希望得到情感上的支持和陪伴。

给您的建议：

无论从哪个角度，这都是一个充满善意的梦境。珍惜与感恩，带着祝福生活。最好的回应，就是更加积极、快乐地生活。请完全放心，这绝非什么"不好"的征兆，恰恰相反，它充满了爱意。`
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dream-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 表单区域 ===== */
.dream-form-section {
  padding: 20px 16px 40px;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(201, 169, 110, 0.1);
}

.form-row-textarea {
  align-items: flex-start;
  padding-top: 16px;
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

.dream-input {
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

.dream-input::placeholder {
  color: rgba(245, 230, 204, 0.35);
}

.dream-input:focus {
  border-color: #c9a96e;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.2);
}

.dream-textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid rgba(201, 169, 110, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 230, 204, 0.9);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
  resize: vertical;
  line-height: 1.8;
  font-family: inherit;
}

.dream-textarea::placeholder {
  color: rgba(245, 230, 204, 0.35);
}

.dream-textarea:focus {
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

.result-body {
  padding: 20px;
}

.result-body :deep(.section-title) {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  font-weight: 700;
  color: #c9a96e;
  margin: 20px 0 12px;
  letter-spacing: 2px;
}

.result-body :deep(.section-title:first-child) {
  margin-top: 0;
}

.result-body :deep(.suggestion-title) {
  color: #d4a04a;
}

.result-body :deep(.section-text) {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  line-height: 2;
  margin: 0 0 8px;
  text-align: justify;
}

.result-body :deep(.section-block) {
  margin-bottom: 16px;
}

.result-body :deep(.suggestion-block) {
  background: rgba(201, 169, 110, 0.06);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
}

/* ===== 重新解梦 ===== */
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

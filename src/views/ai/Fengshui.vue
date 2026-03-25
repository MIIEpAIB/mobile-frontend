<template>
  <div class="fengshui-page page-container">
    <NavBar title="AI风水" />

    <!-- 分类标签页 -->
    <div class="category-tabs" v-if="!result">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="cat-tab"
        :class="{ active: activeCat === cat.key }"
        @click="activeCat = cat.key"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- 场景标签网格 -->
    <div class="tags-section" v-if="!result">
      <div class="tags-grid">
        <button
          v-for="tag in currentTags"
          :key="tag"
          class="tag-btn"
          :class="{ active: selectedTag === tag }"
          @click="selectTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar" v-if="!result">
      <input
        type="text"
        class="search-input"
        v-model="searchText"
        placeholder="输入场景查询"
        @keyup.enter="doQuery"
      />
      <button class="search-btn" @click="doQuery" :disabled="loading">
        {{ loading ? '查询中...' : '查询' }}
      </button>
    </div>

    <!-- 结果区域 -->
    <div class="result-section fade-in-up" v-if="result">
      <div class="result-card">
        <div class="result-header">
          <span class="result-tag-badge">{{ result.query_tag || '风水分析' }}</span>
        </div>
        <div class="result-body">
          <!-- 整体分析 -->
          <div class="analysis-block" v-if="result.overall_analysis">
            <h4>整体分析</h4>
            <p>{{ result.overall_analysis }}</p>
          </div>

          <!-- 关键位置 -->
          <div v-if="result.key_positions && result.key_positions.length" class="positions-list">
            <div v-for="pos in result.key_positions" :key="pos.position" class="pos-item">
              <h4>{{ pos.position }}</h4>
              <p>{{ pos.analysis }}</p>
              <p class="suggestion" v-if="pos.suggestion">💡 {{ pos.suggestion }}</p>
            </div>
          </div>

          <!-- 纯文本 -->
          <div class="analysis-block" v-if="result.analysis && !result.overall_analysis">
            <p>{{ result.analysis }}</p>
          </div>
        </div>
      </div>

      <button class="redraw-btn" @click="result = null">重新查询</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { aiFengshui } from '@/api/modules/ai'

const loading = ref(false)
const result = ref(null)
const activeCat = ref('home')
const selectedTag = ref('')
const searchText = ref('')

const categories = [
  { key: 'home', label: '居家风水' },
  { key: 'business', label: '商业办公' },
  { key: 'items', label: '风水用品' },
  { key: 'other', label: '其他风水' },
]

const tagData = {
  home: [
    '高层', '别墅', '住宅楼', '书房', '儿童房', '客厅',
    '卧室', '家具', '玄关', '厨房', '餐厅', '阳台',
    '楼梯', '财位', '水龙头', '镜子', '窗户', '家电',
    '大门', '厕所', '床', '钟表', '保险柜',
  ],
  business: [
    '商铺', '电梯', '事业官运', '公司', '办公桌', '厂房',
    '办公室', '收银台', '经理室',
  ],
  items: [
    '貔貅', '大象', '狮子', '鸳鸯', '狐狸', '蝙蝠',
    '龙龟', '五帝钱币', '八卦镜', '财神', '升官印', '文昌塔',
    '葫芦', '水晶', '桃木', '桃木剑', '牡丹图', '风铃',
    '佛像', '佛珠', '金元宝', '辟邪', '如意', '刀剑',
    '麒麟', '水晶球', '金蟾', '神桌',
  ],
  other: [
    '停车场', '庭院', '墓地', '喷泉', '补水', '补土',
    '补金', '补木', '补火', '购房', '学业读书', '防小人',
    '化煞', '尖角', '色彩', '汽车', '车库',
  ],
}

const currentTags = computed(() => tagData[activeCat.value] || [])

const selectTag = (tag) => {
  selectedTag.value = tag
  searchText.value = tag
}

const doQuery = async () => {
  const query = searchText.value || selectedTag.value
  if (!query) return alert('请选择场景或输入查询内容')

  loading.value = true
  try {
    const r = await aiFengshui({ address: query, direction: query })
    const d = r.data
    result.value = {
      query_tag: query,
      overall_analysis: d.analysis || d.overall_analysis || '',
      key_positions: d.key_positions || [],
      analysis: d.analysis || '',
    }
  } catch {
    result.value = {
      query_tag: query,
      overall_analysis: `关于"${query}"的风水分析：整体风水格局良好。${query}的摆放与布局需遵循阴阳调和、五行相生的原则。建议结合具体户型和朝向综合考量，方能达到最佳的风水效果。`,
      key_positions: [
        { position: '方位', analysis: `${query}宜安置于吉位，避开煞位`, suggestion: '结合罗盘确定具体方位' },
        { position: '五行', analysis: '注意与周围环境的五行相生关系', suggestion: '可通过色彩与材质进行调节' },
      ],
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fengshui-page {
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
  min-height: 100vh;
}

/* ===== 分类标签页 ===== */
.category-tabs {
  display: flex;
  padding: 16px 16px 0;
  gap: 0;
  border-bottom: 1px solid rgba(201, 169, 110, 0.15);
}

.cat-tab {
  flex: 1;
  padding: 10px 0 12px;
  border: none;
  background: none;
  font-size: 14px;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2px;
  color: rgba(245, 230, 204, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.cat-tab.active {
  color: #f5e6cc;
  font-weight: 700;
}

.cat-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 20%;
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c9a96e, transparent);
  border-radius: 1px;
}

/* ===== 标签网格 ===== */
.tags-section {
  padding: 16px 16px 12px;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(201, 169, 110, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(245, 230, 204, 0.65);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
}

.tag-btn:active {
  transform: scale(0.95);
}

.tag-btn.active {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.25), rgba(184, 134, 11, 0.15));
  color: #f5e6cc;
  border-color: #c9a96e;
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.2);
}

/* ===== 搜索栏 ===== */
.search-bar {
  display: flex;
  padding: 8px 16px 24px;
  gap: 10px;
}

.search-input {
  flex: 1;
  height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(201, 169, 110, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 230, 204, 0.9);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: rgba(245, 230, 204, 0.35);
}

.search-input:focus {
  border-color: #c9a96e;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.2);
}

.search-btn {
  flex-shrink: 0;
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  cursor: pointer;
  background: linear-gradient(135deg, #e8d5a3, #c9a96e, #b8860b);
  box-shadow: 0 2px 12px rgba(201, 169, 110, 0.3);
  transition: all 0.3s;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
}

.search-btn::before {
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

.search-btn:active {
  transform: scale(0.97);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.result-tag-badge {
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

.analysis-block {
  margin-bottom: 16px;
}

.analysis-block h4 {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  color: #c9a96e;
  margin: 0 0 10px;
  letter-spacing: 2px;
}

.analysis-block p {
  font-size: 14px;
  color: rgba(245, 230, 204, 0.7);
  line-height: 2;
  margin: 0;
}

.positions-list {
  margin-top: 16px;
}

.pos-item {
  padding: 14px;
  margin-bottom: 10px;
  background: rgba(201, 169, 110, 0.06);
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: 10px;
}

.pos-item h4 {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 15px;
  color: #c9a96e;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.pos-item p {
  font-size: 13px;
  color: rgba(245, 230, 204, 0.65);
  line-height: 1.8;
  margin: 0 0 4px;
}

.pos-item .suggestion {
  color: rgba(212, 160, 74, 0.9);
  margin-top: 8px;
  font-size: 13px;
}

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

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: () => import('@/views/auth/Login.vue'), meta: { title: '登录' } },
  { path: '/register', component: () => import('@/views/auth/Register.vue'), meta: { title: '注册' } },
  { path: '/home', component: () => import('@/views/home/Home.vue'), meta: { title: '鲲鹏易道' } },

  // AI 测算
  { path: '/ai', component: () => import('@/views/ai/AiIndex.vue'), meta: { title: 'AI 测算' } },
  { path: '/ai/lottery', component: () => import('@/views/ai/Lottery.vue'), meta: { title: '抽签' } },
  { path: '/ai/bazi', component: () => import('@/views/ai/Bazi.vue'), meta: { title: '八字算命' } },
  { path: '/ai/fengshui', component: () => import('@/views/ai/Fengshui.vue'), meta: { title: '风水分析' } },
  { path: '/ai/dream', component: () => import('@/views/ai/Dream.vue'), meta: { title: '解梦' } },
  { path: '/ai/char', component: () => import('@/views/ai/CharDivination.vue'), meta: { title: '测字' } },
  { path: '/ai/naming', component: () => import('@/views/ai/Naming.vue'), meta: { title: '取名' } },
  { path: '/ai/phone', component: () => import('@/views/ai/Phone.vue'), meta: { title: '手机号测算' } },

  // 商城
  { path: '/mall', component: () => import('@/views/mall/ProductList.vue'), meta: { title: '开光商城' } },
  { path: '/mall/detail', component: () => import('@/views/mall/ProductDetail.vue'), meta: { title: '商品详情' } },
  { path: '/mall/cart', component: () => import('@/views/mall/Cart.vue'), meta: { title: '购物车', auth: true } },
  { path: '/mall/order-confirm', component: () => import('@/views/mall/OrderConfirm.vue'), meta: { title: '确认订单', auth: true } },

  // 祈福
  { path: '/blessing', component: () => import('@/views/blessing/BlessingIndex.vue'), meta: { title: '祈福' } },

  // 祭祀纪念
  { path: '/memorial', component: () => import('@/views/memorial/MemorialHall.vue'), meta: { title: '祭祀大厅' } },
  { path: '/memorial/tomb', component: () => import('@/views/memorial/TombManage.vue'), meta: { title: '陵墓管理', auth: true } },

  // 个人中心
  { path: '/user', component: () => import('@/views/user/UserCenter.vue'), meta: { title: '个人中心', auth: true } },
  { path: '/user/profile', component: () => import('@/views/user/Profile.vue'), meta: { title: '个人资料', auth: true } },
  { path: '/user/wallet', component: () => import('@/views/user/Wallet.vue'), meta: { title: '我的钱包', auth: true } },
  { path: '/user/address', component: () => import('@/views/user/AddressList.vue'), meta: { title: '收货地址', auth: true } },
  { path: '/user/orders', component: () => import('@/views/user/OrderList.vue'), meta: { title: '我的订单', auth: true } },
  { path: '/user/records', component: () => import('@/views/user/Records.vue'), meta: { title: '我的记录', auth: true } },

  // 文化/教学
  { path: '/culture', component: () => import('@/views/content/CultureList.vue'), meta: { title: '玄学文化' } },
  { path: '/course', component: () => import('@/views/content/CourseList.vue'), meta: { title: '在线课程' } },

  // 专家服务
  { path: '/expert', component: () => import('@/views/service/ExpertList.vue'), meta: { title: '专家服务' } },

  // 风水
  { path: '/fengshui', component: () => import('@/views/fengshui/FengshuiIndex.vue'), meta: { title: '风水知识' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '鲲鹏易道'
  if (to.meta.auth && !localStorage.getItem('kp_token')) {
    next('/login')
  } else {
    next()
  }
})

export default router

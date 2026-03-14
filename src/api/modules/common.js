import request from '../request'

// 导航菜单
export const getConfigNav = () => request.get('/config/nav')

// 底部信息
export const getConfigFooter = () => request.get('/config/footer')

// 玄学文化列表
export const getCultureList = (params) => request.get('/content/culture/list', { params })

// 文化详情
export const getCultureDetail = (params) => request.get('/content/culture/detail', { params })

// 课程列表
export const getCourseList = (params) => request.get('/content/course/list', { params })

// 课程详情
export const getCourseDetail = (params) => request.get('/content/course/detail', { params })

// 专家列表
export const getExpertList = (params) => request.get('/service/expert/list', { params })

// 预约专家
export const bookExpert = (data) => request.post('/service/expert/book', data)

// 祈福服务
export const serviceBlessing = (data) => request.post('/service/blessing', data)

// 祭祀服务
export const serviceSacrifice = (data) => request.post('/service/sacrifice', data)

// 测字目的列表
export const getDivinationPurposes = () => request.get('/divination/purpose/list')

// 测字计算
export const characterCalculate = (data) => request.post('/divination/character/calculate', data)

// 测字历史
export const getDivinationHistory = (params) => request.get('/divination/history/list', { params })

// 测字详情
export const getDivinationDetail = (params) => request.get('/divination/history/detail', { params })

// 抽签目的列表
export const getLotteryPurposes = () => request.get('/lottery/purpose/list')

// 抽签
export const lotteryDraw = (data) => request.post('/lottery/draw', data)

// 抽签历史
export const getLotteryHistory = (params) => request.get('/lottery/history/list', { params })

// 抽签详情
export const getLotteryDetail = (params) => request.get('/lottery/history/detail', { params })

// 解签
export const lotteryInterpret = (data) => request.post('/lottery/interpret', data)

// 风水分类树
export const getFengshuiCategoryTree = () => request.get('/fengshui/category/tree')

// 风水搜索
export const fengshuiSearch = (params) => request.get('/fengshui/search', { params })

// 风水详情
export const getFengshuiDetail = (params) => request.get('/fengshui/detail', { params })

// 解梦
export const dreamInterpret = (data) => request.post('/dream/interpret', data)

// 解梦历史
export const getDreamHistory = (params) => request.get('/dream/history/list', { params })

// 商城订单确认
export const storeOrderConfirm = (params) => request.get('/store/order/confirm', { params })

// 商城提交订单
export const storeOrderSubmit = (data) => request.post('/store/order/submit', data)

// 商城支付
export const storeOrderPay = (data) => request.post('/store/order/pay', data)

// 充值配置
export const getRechargeConfig = () => request.get('/account/recharge/config')

// 创建充值订单
export const createRechargeOrder = (data) => request.post('/account/recharge/order/create', data)

// 查询充值订单状态
export const getRechargeOrderStatus = (params) => request.get('/account/recharge/order/status', { params })

// 文章详情
export const getArticleDetail = (params) => request.get('/metaphysics/article/detail', { params })

// 商品详情(旧)
export const getProductDetail = (params) => request.get('/product/detail', { params })

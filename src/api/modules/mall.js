import request from '../request'

// 商品筛选选项
export const getFilterOptions = () => request.get('/mall/product/filter/options')

// 商品列表
export const getProductList = (params) => request.get('/mall/product/list', { params })

// 商品详情
export const getProductDetail = (params) => request.get('/mall/product/detail', { params })

// 加入购物车
export const addToCart = (data) => request.post('/mall/cart/add', data)

// 立即购买创建订单
export const createOrder = (data) => request.post('/mall/order/create', data)

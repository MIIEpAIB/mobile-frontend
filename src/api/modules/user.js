import request from '../request'

// 获取图形验证码
export const getCaptchaImage = () => request.get('/user/captcha/image')

// 用户登录（账号密码+验证码）
export const userLogin = (data) => request.post('/user/login', data)

// 短信验证码发送
export const sendSms = (data) => request.post('/user/sms/send', data)

// 短信验证码登录
export const loginBySms = (data) => request.post('/user/login/sms', data)

// 密码登录
export const loginByPassword = (data) => request.post('/user/login/password', data)

// 获取用户信息
export const getUserInfo = () => request.get('/user/info')

// 个人中心首页
export const getCenterIndex = () => request.get('/user/center/index')

// 个人资料详情
export const getProfileDetail = () => request.get('/user/profile/detail')

// 更新个人资料
export const updateProfile = (data) => request.post('/user/profile/update', data)

// 修改昵称
export const updateNickname = (data) => request.post('/user/profile/nickname/update', data)

// 修改密码
export const updatePassword = (data) => request.post('/user/password/update', data)

// 发送修改密码验证码
export const sendPasswordSms = () => request.post('/user/password/send_sms')

// 验证码修改密码
export const changePassword = (data) => request.post('/user/password/change', data)

// 祈福记录
export const getBlessingRecords = (params) => request.get('/user/blessing/records', { params })

// 祭祀记录
export const getMemorialRecords = (params) => request.get('/user/memorial/records', { params })

// 账变记录
export const getBalanceRecords = (params) => request.get('/user/balance/records', { params })

// 测算记录
export const getDivinationRecords = (params) => request.get('/user/divination/records', { params })

// 购物车列表
export const getCartList = () => request.get('/user/cart/list')

// 更新购物车数量
export const updateCartQuantity = (data) => request.post('/user/cart/quantity/update', data)

// 删除购物车项
export const deleteCartItem = (data) => request.post('/user/cart/delete', data)

// 选中/取消商品
export const selectCartItem = (data) => request.post('/user/cart/select', data)

// 全选/取消全选
export const selectAllCart = (data) => request.post('/user/cart/select/all', data)

// 购物车结算价
export const calculateCart = () => request.get('/user/cart/calculate')

// 购物车结算
export const checkoutCart = (data) => request.post('/user/cart/checkout', data)

// 订单列表
export const getOrderList = (params) => request.get('/user/order/list', { params })

// 订单详情
export const getOrderDetail = (params) => request.get('/user/order/detail', { params })

// 地址列表
export const getAddressList = () => request.get('/user/address/list')

// 新增地址
export const addAddress = (data) => request.post('/user/address/add', data)

// 修改地址
export const updateAddress = (data) => request.post('/user/address/update', data)

// 删除地址
export const deleteAddress = (data) => request.post('/user/address/delete', data)

// 设置默认地址
export const setDefaultAddress = (data) => request.post('/user/address/set_default', data)

// 信用卡列表
export const getCreditCardList = () => request.get('/user/credit_card/list')

// 新增信用卡
export const addCreditCard = (data) => request.post('/user/credit_card/add', data)

// 删除信用卡
export const deleteCreditCard = (data) => request.post('/user/credit_card/delete', data)

// 设置默认信用卡
export const setDefaultCreditCard = (data) => request.post('/user/credit_card/set_default', data)

// 银行列表
export const getCreditCardBanks = () => request.get('/user/credit_card/banks')

// 发送绑卡验证码
export const sendCreditCardSms = (data) => request.post('/user/credit_card/send_sms', data)

// 支付用信用卡列表
export const getCreditCardListForPay = () => request.get('/user/credit_card/list_for_pay')

// 钱包流水
export const getWalletTransactions = (params) => request.get('/user/wallet/transactions', { params })

// 创建充值订单
export const createWalletRecharge = (data) => request.post('/user/wallet/recharge/create', data)

// 获取充值二维码
export const getRechargeQrcode = (data) => request.post('/user/wallet/recharge/qrcode', data)

// 取消充值
export const cancelRecharge = (data) => request.post('/user/wallet/recharge/cancel', data)

// 查询充值状态
export const getRechargeStatus = (params) => request.get('/user/wallet/recharge/status', { params })

// 绑定银行卡
export const bindBankcard = (data) => request.post('/user/bankcard/bind', data)

import request from '../request'

// 祈福方式列表
export const getBlessingMethods = () => request.get('/blessing/methods/list')

// 祈福动态列表
export const getBlessingFeed = (params) => request.get('/blessing/feed/list', { params })

// 提交祈福
export const submitBlessing = (data) => request.post('/blessing/submit', data)

// 祈福明灯列表
export const getBlessingLanterns = (params) => request.get('/blessing/lantern/list', { params })

// 点亮明灯
export const lightLantern = (data) => request.post('/blessing/lantern/light', data)

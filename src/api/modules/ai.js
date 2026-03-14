import request from '../request'

// 抽签
export const aiDraw = (data) => request.post('/ai/divination/draw', data)

// 八字算命
export const aiBazi = (data) => request.post('/ai/divination/bazi', data)

// 风水分析
export const aiFengshui = (data) => request.post('/ai/divination/fengshui', data)

// 解梦
export const aiDream = (data) => request.post('/ai/divination/dream', data)

// 测字
export const aiChar = (data) => request.post('/ai/divination/char', data)

// 取名
export const aiNaming = (data) => request.post('/ai/divination/naming', data)

// 手机号测算
export const aiPhone = (data) => request.post('/ai/divination/phone', data)

// 媒体测算
export const aiMedia = (data) => request.post('/ai/divination/media', data)

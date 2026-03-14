import request from '../request'

// 陵墓详情
export const getTombDetail = (params) => request.get('/memorial/tomb/detail', { params })

// 保存陵墓
export const saveTomb = (data) => request.post('/memorial/tomb/save', data)

// 更新陵墓
export const updateTomb = (data) => request.post('/memorial/tomb/update', data)

// 删除陵墓
export const deleteTomb = (data) => request.post('/memorial/tomb/delete', data)

// 关系选项
export const getRelationshipOptions = () => request.get('/memorial/tomb/relationship/options')

// 上传陵墓图片
export const uploadTombImage = (formData) => request.post('/memorial/tomb/image/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// 祭祀大厅首页
export const getMemorialHallIndex = () => request.get('/memorial/hall/index')

// 贡品列表
export const getOfferingsList = (params) => request.get('/memorial/offerings/list', { params })

// 提交祭祀
export const submitMemorial = (data) => request.post('/memorial/submit', data)

// 陵园广场列表
export const getSquareList = (params) => request.get('/memorial/square/list', { params })

// 我的陵墓列表
export const getMyTombList = (params) => request.get('/memorial/my/list', { params })

// 广场动态
export const getSquareFeed = (params) => request.get('/memorial/square/feed', { params })

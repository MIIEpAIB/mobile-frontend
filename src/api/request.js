import axios from 'axios'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器 - 自动注入 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('kp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 0) {
      return res
    }
    if (res.code === 401) {
      localStorage.removeItem('kp_token')
      localStorage.removeItem('kp_user')
      router.push('/login')
      return Promise.reject(new Error('登录已过期'))
    }
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kp_token')
      localStorage.removeItem('kp_user')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request

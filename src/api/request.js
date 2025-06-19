import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据你的API响应格式，成功的响应status为'success'
    if (res.status === 'success' || (res.status !== 'error' && res.data)) {
      return res
    } else {
      // 错误处理
      ElMessage.error(res.error?.message || '请求失败')
      return Promise.reject(new Error(res.error?.message || '请求失败'))
    }
  },
  error => {
    console.error('响应错误：', error)
    
    // 处理网络错误
    if (error.response) {
      const { status, data } = error.response
      let message = data?.error?.message || '请求失败'
      
      switch (status) {
        case 400:
          message = data?.error?.message || '请求参数错误'
          break
        case 401:
          message = data?.error?.message || '未授权，请登录'
          break
        case 404:
          message = data?.error?.message || '请求的资源不存在'
          break
        case 500:
          message = data?.error?.message || '服务器错误'
          break
        default:
          message = `请求失败: ${status}`
      }
      
      ElMessage.error(message)
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default request
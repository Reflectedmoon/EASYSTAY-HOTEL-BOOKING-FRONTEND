import axios from 'axios'
import { showLoading, hideLoading, showToast } from '@tarojs/taro'

// 创建 axios 实例
const request = axios.create({
  // 使用 Taro defineConstants 定义的环境变量，添加 fallback
  baseURL: typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 显示加载提示
    if (!config.hideLoading) {
      showLoading({
        title: config.loadingText || '加载中...',
        mask: true
      })
    }

    // 添加认证 token
    const token = Taro.getStorageSync('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    hideLoading()
    
    // 统一处理响应数据
    const { data, status } = response
    
    if (status === 200) {
      return response
    }
    
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  error => {
    hideLoading()
    
    // 统一错误处理
    const { response } = error
    
    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 401:
          // 未授权，清除本地存储并跳转登录
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userInfo')
          showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          // 跳转到登录页
          setTimeout(() => {
            Taro.navigateTo({ url: '/pages/login/index' })
          }, 1500)
          break
          
        case 403:
          showToast({
            title: '权限不足',
            icon: 'none'
          })
          break
          
        case 404:
          showToast({
            title: '请求的资源不存在',
            icon: 'none'
          })
          break
          
        case 500:
          showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
          break
          
        default:
          showToast({
            title: data?.message || '请求失败',
            icon: 'none'
          })
      }
    } else {
      // 网络错误
      showToast({
        title: '网络连接异常',
        icon: 'none'
      })
    }
    
    return Promise.reject(error)
  }
)

export default request
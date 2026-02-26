import Taro from '@tarojs/taro'

/**
 * 格式化价格显示
 * @param {number} price - 价格
 * @returns {string} 格式化后的价格字符串
 */
export const formatPrice = (price) => {
  if (!price) return '¥0'
  return `¥${parseFloat(price).toFixed(2)}`
}

/**
 * 格式化日期显示
 * @param {string|Date} date - 日期
 * @param {string} format - 格式
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay = 300) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, delay = 300) => {
  let lastExecTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastExecTime >= delay) {
      func.apply(this, args)
      lastExecTime = now
    }
  }
}

/**
 * 检查是否登录
 * @returns {boolean} 是否已登录
 */
export const isLogin = () => {
  return !!Taro.getStorageSync('token')
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  const userInfo = Taro.getStorageSync('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * 存储用户信息
 * @param {Object} userInfo - 用户信息
 */
export const setUserInfo = (userInfo) => {
  Taro.setStorageSync('userInfo', JSON.stringify(userInfo))
  Taro.setStorageSync('token', userInfo.token)
}

/**
 * 清除用户信息
 */
export const clearUserInfo = () => {
  Taro.removeStorageSync('userInfo')
  Taro.removeStorageSync('token')
}

/**
 * 页面跳转封装
 * @param {string} url - 页面路径
 * @param {Object} params - 参数对象
 */
export const navigateTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  const fullUrl = queryString ? `${url}?${queryString}` : url
  
  Taro.navigateTo({ url: fullUrl })
}

/**
 * 显示成功提示
 * @param {string} title - 提示文字
 */
export const showSuccess = (title) => {
  Taro.showToast({
    title,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 * @param {string} title - 提示文字
 */
export const showError = (title) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
export const showLoading = (title = '加载中...') => {
  Taro.showLoading({ title, mask: true })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  Taro.hideLoading()
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}
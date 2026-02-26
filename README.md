# EasyStay Hotel Booking 前端项目

基于 Taro 3.x + React 的多端酒店预订应用前端项目

## 🚀 技术栈

- **框架**: Taro 3.6.16 + React 18
- **状态管理**: Redux Toolkit
- **UI 组件库**: Taro UI 3.1.0
- **网络请求**: Axios 1.4.0
- **样式预处理器**: Sass
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript (可选)
- **测试框架**: Jest

## 📦 项目结构

```
├── config/                 # Taro 配置文件
│   ├── index.js           # 主配置文件
│   ├── dev.js            # 开发环境配置
│   └── prod.js           # 生产环境配置
├── src/                   # 源代码目录
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── pages/           # 页面组件
│   ├── store/           # Redux 状态管理
│   ├── utils/           # 工具函数
│   ├── app.js           # 应用入口
│   ├── app.scss         # 全局样式
│   └── index.html       # H5 模板
├── .vscode/             # VSCode 配置
├── package.json         # 项目依赖配置
└── README.md           # 项目文档
```

## 🔧 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

## 🛠️ 快速开始

### 1. 初始化项目

```bash
# Windows 用户可以直接运行
init-project.bat

# 或者手动执行以下命令
npm install
```

### 2. 开发调试

```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:weapp

# 支付宝小程序开发
npm run dev:alipay

# 其他平台开发
npm run dev:swan    # 百度小程序
npm run dev:tt      # 字节跳动小程序
npm run dev:qq      # QQ 小程序
```

### 3. 生产构建

```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:weapp

# 多端构建
npm run build:alipay
npm run build:swan
npm run build:tt
npm run build:qq
```

## 🎯 核心功能模块

### 状态管理 (Redux Toolkit)

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import hotelSlice from './hotelSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    hotel: hotelSlice
  }
})
```

### 网络请求封装 (Axios)

```javascript
// utils/request.js
import axios from 'axios'
import { showLoading, hideLoading } from '@tarojs/taro'

const request = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    showLoading({ title: '加载中...' })
    // 添加 token 等
    return config
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    hideLoading()
    return response.data
  },
  error => {
    hideLoading()
    // 错误处理
    return Promise.reject(error)
  }
)

export default request
```

### Taro UI 组件使用

```javascript
import { AtButton, AtInput, AtCard } from 'taro-ui'

function LoginPage() {
  return (
    <View className='login-page'>
      <AtCard title='用户登录'>
        <AtInput
          name='username'
          title='用户名'
          type='text'
          placeholder='请输入用户名'
        />
        <AtInput
          name='password'
          title='密码'
          type='password'
          placeholder='请输入密码'
        />
        <AtButton type='primary'>登录</AtButton>
      </AtCard>
    </View>
  )
}
```

## 📱 多端适配

### 平台特定代码

```javascript
// 使用 process.env.TARO_ENV 判断平台
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序特有逻辑
} else if (process.env.TARO_ENV === 'h5') {
  // H5 特有逻辑
}
```

### 样式适配

```scss
// 使用 CSS 变量适配不同平台
.container {
  padding: 20px;
  
  /* 微信小程序 */
  wx: {
    padding: 30px;
  }
  
  /* H5 */
  h5: {
    padding: 15px;
  }
}
```

## 🔍 开发工具

### ESLint 配置

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

### Prettier 格式化

```bash
# 格式化代码
npm run prettier
```

### 单元测试

```bash
# 运行测试
npm run test

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test:coverage
```

## 🚀 部署指南

### H5 部署

```bash
# 构建生产版本
npm run build:h5

# 部署 dist 目录到服务器
```

### 小程序部署

1. 构建对应平台的小程序代码
2. 在开发者工具中上传代码
3. 提交审核并发布

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系项目维护者。
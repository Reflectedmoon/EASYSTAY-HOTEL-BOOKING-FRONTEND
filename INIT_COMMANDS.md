# Taro 3.x + React 项目初始化完整命令

## 📋 项目初始化步骤

### 1. 环境准备
```bash
# 检查 Node.js 版本 (需要 >= 16.0.0)
node --version

# 检查 npm 版本
npm --version
```

### 2. 全局安装 Taro CLI
```bash
# 安装指定版本的 Taro CLI
npm install -g @tarojs/cli@3.6.16

# 验证安装
taro --version
```

### 3. 项目依赖安装
```bash
# 安装所有项目依赖
npm install

# 或使用 yarn
yarn install
```

### 4. 开发环境启动

#### H5 开发
```bash
# 启动 H5 开发服务器
npm run dev:h5

# 访问地址: http://localhost:10086
```

#### 微信小程序开发
```bash
# 编译微信小程序 (监听模式)
npm run dev:weapp

# 在微信开发者工具中打开 dist/weapp 目录
```

#### 其他平台开发
```bash
# 支付宝小程序
npm run dev:alipay

# 百度小程序
npm run dev:swan

# 字节跳动小程序
npm run dev:tt

# QQ 小程序
npm run dev:qq

# 快应用
npm run dev:quickapp
```

### 5. 生产环境构建

#### H5 构建
```bash
npm run build:h5
# 输出目录: dist/
```

#### 小程序构建
```bash
# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:alipay

# 其他平台类似...
```

## 🛠️ 开发工具命令

### 代码质量检查
```bash
# ESLint 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# Prettier 代码格式化
npm run prettier
```

### 测试相关
```bash
# 运行单元测试
npm run test

# 监听模式运行测试
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

## ⚡ 快捷脚本使用

### Windows 用户
```bash
# 一键初始化项目
init-project.bat

# 启动开发服务器 (交互式选择平台)
start-dev.bat
```

### Mac/Linux 用户
```bash
# 给脚本添加执行权限
chmod +x init-project.sh
chmod +x start-dev.sh

# 执行初始化
./init-project.sh

# 启动开发
./start-dev.sh
```

## 🎯 项目特色功能

### 1. Redux Toolkit 集成
- 完整的状态管理解决方案
- 包含用户认证和酒店数据管理
- 异步操作处理

### 2. Axios 网络请求封装
- 统一的请求拦截和响应处理
- 自动 Loading 状态管理
- 错误统一处理机制

### 3. Taro UI 组件库
- 丰富的移动端组件
- 统一的设计语言
- 良好的用户体验

### 4. 多端适配
- 一套代码多端运行
- 平台差异自动处理
- 响应式设计支持

## 🔧 常见问题解决

### 依赖安装问题
```bash
# 清理缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 端口占用问题
```bash
# 修改 H5 开发服务器端口
# 在 config/dev.js 中添加:
h5: {
  devServer: {
    port: 3000 // 修改为你想要的端口
  }
}
```

### 构建失败问题
```bash
# 清理构建缓存
rm -rf dist .temp

# 重新构建
npm run build:h5
```

## 📱 平台特定配置

### 微信小程序配置
```javascript
// config/index.js
mini: {
  webpackChain(chain) {
    // 微信小程序特定配置
  }
}
```

### H5 特定配置
```javascript
// config/index.js
h5: {
  publicPath: '/', // 根据部署路径调整
  staticDirectory: 'static'
}
```

这个项目已经配置好了现代化的前端开发环境，包含了完整的工程化配置和最佳实践！
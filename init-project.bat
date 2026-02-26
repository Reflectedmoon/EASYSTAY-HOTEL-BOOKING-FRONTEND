@echo off
echo ========================================
echo EasyStay Hotel Booking - Taro 项目初始化
echo ========================================

echo 正在检查 Node.js 版本...
node --version

echo.
echo 正在安装项目依赖...
npm install

echo.
echo 正在验证 Taro CLI 是否已安装...
npx taro --version

if %errorlevel% neq 0 (
    echo 正在全局安装 Taro CLI...
    npm install -g @tarojs/cli@3.6.16
)

echo.
echo ========================================
echo 项目初始化完成！
echo ========================================
echo 可用命令：
echo npm run dev:h5       - 启动 H5 开发服务器
echo npm run dev:weapp    - 编译微信小程序（监听模式）
echo npm run build:h5     - 构建 H5 生产版本
echo npm run build:weapp  - 构建微信小程序生产版本
echo ========================================

pause
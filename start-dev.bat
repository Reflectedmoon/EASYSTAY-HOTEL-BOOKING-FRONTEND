@echo off
echo ========================================
echo EasyStay Hotel Booking 开发服务器启动
echo ========================================

echo 请选择开发平台：
echo 1. H5 (Web)
echo 2. 微信小程序
echo 3. 支付宝小程序
echo 4. 百度小程序
echo 5. 字节跳动小程序
echo 6. QQ 小程序

set /p choice=请输入选择 (1-6): 

if "%choice%"=="1" (
    echo 启动 H5 开发服务器...
    npm run dev:h5
) else if "%choice%"=="2" (
    echo 启动微信小程序开发模式...
    npm run dev:weapp
) else if "%choice%"=="3" (
    echo 启动支付宝小程序开发模式...
    npm run dev:alipay
) else if "%choice%"=="4" (
    echo 启动百度小程序开发模式...
    npm run dev:swan
) else if "%choice%"=="5" (
    echo 启动字节跳动小程序开发模式...
    npm run dev:tt
) else if "%choice%"=="6" (
    echo 启动 QQ 小程序开发模式...
    npm run dev:qq
) else (
    echo 无效选择，默认启动 H5 开发服务器...
    npm run dev:h5
)

pause
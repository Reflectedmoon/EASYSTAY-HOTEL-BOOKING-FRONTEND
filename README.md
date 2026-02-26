# 易宿酒店预订平台 (YISU Hotel Booking Platform)

这是一个基于 React + Node.js (Express) + SQLite 构建的全栈酒店预订平台。包含移动端用户预订流程和 PC 端商户/管理员后台。

## 项目结构

- `src/pages/mobile/`: 移动端用户界面 (首页、列表页、详情页)
- `src/pages/admin/`: PC 端管理后台 (登录注册、控制台、酒店表单)
- `server.ts`: Express 后端服务入口，包含所有 API 路由
- `src/db.ts`: SQLite 数据库初始化和连接配置

## 本地开发

1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发服务器 (前端 Vite + 后端 Express):
   ```bash
   npm run dev
   ```

3. 访问:
   - 移动端: `http://localhost:3000/`
   - 管理端: `http://localhost:3000/admin/login`

## 默认账号

系统初始化时会自动创建一个管理员账号：
- 用户名: `admin`
- 密码: `admin123`
- 角色: `admin` (管理员)

商户账号可以在 `/admin/login` 页面自行注册。

## 生产环境部署 (Ubuntu + Docker)

本项目支持使用 Docker 快速部署到云服务器。

### 1. 准备工作

确保服务器已安装 Docker 和 Docker Compose。

### 2. 构建镜像

```bash
docker build -t yisu-hotel-app .
```

### 3. 运行容器

```bash
docker run -d -p 80:3000 --name yisu-app -v $(pwd)/data.db:/app/data.db yisu-hotel-app
```

或者使用 Docker Compose:

```bash
docker-compose up -d
```

### 4. 访问服务

部署完成后，通过服务器的公网 IP 即可访问服务。

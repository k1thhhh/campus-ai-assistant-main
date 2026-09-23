# 校园 AI 助手：课程起始项目

这是《AI 大前端项目开发》第 1 讲使用的最小工程骨架，只完成项目配置，不提供聊天功能答案。

## 项目结构

```text
campus-ai-assistant/
├─ apps/
│  ├─ web/                  # Vue 3 前端
│  │  ├─ src/
│  │  │  ├─ App.vue
│  │  │  ├─ env.d.ts
│  │  │  └─ main.ts
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ server/               # Express 后端
│     ├─ src/index.ts
│     ├─ .env.example
│     ├─ package.json
│     └─ tsconfig.json
├─ packages/
│  └─ shared-types/         # 前后端共享类型
│     ├─ src/index.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ .husky/                  # Git 提交检查
├─ eslint.config.js
├─ prettier.config.mjs
├─ commitlint.config.cjs
├─ lint-staged.config.mjs
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ package.json
```

## 已配置内容

- pnpm Monorepo；
- Vue 3、Vite、Pinia、TypeScript；
- Express、TypeScript、dotenv；
- `shared-types` workspace 包；
- ESLint、Prettier、Husky、lint-staged、commitlint；
- Vite `/api` 代理；
- Express `/api/health` 健康检查。

## 学生需要完成

- 定义 `ChatMessage`、`ApiResponse<T>` 等共享类型；
- 实现 `POST /api/chat`；
- 创建消息组件、输入区域和聊天页面；
- 创建 Pinia 聊天 Store；
- 完成前后端请求、错误处理和交互细节。

## 环境要求

- Node.js 20.19 或更高版本；
- pnpm 11 或更高版本。

## 获取与运行

```powershell
git clone <教师提供的仓库地址>
cd campus-ai-assistant
pnpm install
pnpm dev
```

默认地址：

- 前端：<http://localhost:5173>
- 后端健康检查：<http://localhost:3000/api/health>

页面必须通过 HTTP 地址打开，不能双击 HTML 文件使用 `file://`。

## 常用命令

```powershell
pnpm dev          # 同时启动前端和后端
pnpm check        # ESLint + 类型检查 + 构建
pnpm format       # 格式化代码
```

提交信息示例：

```powershell
git add	把修改加入暂存区
git commit	在本地生成一次版本记录
git commit -m "feat: 完成消息组件"
git push	把本地提交上传到Gitee
git pull	把远程更新同步到本地
git clone	第一次把完整远程仓库下载到本地
```

| 类型 | 用途 |
|---|---|
| `feat` | 新增功能 |
| `fix` | 修复错误 |
| `docs` | 修改文档 |
| `refactor` | 重构或精简代码 |
| `style` | 格式调整 |
| `chore` | 工程配置调整 |
| `test` | 测试相关 |

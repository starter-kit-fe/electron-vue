# Electron Vue Project

## 📦 项目简介

这是一个基于 Electron、Vue 3 和 Vite 的现代桌面应用开发模板。提供了一个简单、高效的跨平台桌面应用开发解决方案。

## ✨ 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **桌面应用**: Electron
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **代码规范**: ESLint, Prettier
- **类型检查**: TypeScript

## 🚀 快速开始

### 克隆项目

```bash
git clone <your-repo-url>
cd electron-vue
```

### 安装依赖

```bash
npm install
# 或
bun install
# 或
yarn install
```

## 📋 可用脚本

- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run build:app`: 构建 Electron 应用
- `npm run lint`: 代码风格检查
- `npm run format`: 代码格式化

## 📁 项目结构

```
├── electron/           # Electron 主进程和预加载脚本
├── src/                # 前端源代码
│   ├── components/     # Vue 组件
│   ├── views/          # 页面组件
│   ├── utils/          # 工具函数
│   ├── router.ts       # 路由配置
│   └── store.ts        # 状态管理
├── dist/               # 构建输出目录
└── release/            # 应用发布版本
```

## 🔧 开发配置

- **IDE**: 推荐使用 VSCode
- **推荐插件**:
  - Volar
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## 🌐 浏览器支持

现代浏览器和 Electron 支持的所有桌面平台

## 📝 代码规范

项目使用 ESLint 和 Prettier 进行代码质量和风格控制。运行 `npm run lint` 检查代码规范。

## 🔒 许可证

查看 `LICENSE` 文件了解详情。

## 🤝 贡献指南

请阅读 `CONTRIBUTING.md` 了解如何参与贡献。

## 🐛 问题反馈

如遇到问题，请在 GitHub Issues 中提交。

---

**版本**: v24.1204.1116

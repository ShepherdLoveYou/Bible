
# ✝️ 福音的光 Gospel Light

一个基于 VitePress 构建的福音主题博客，致力于分享圣经真理、节期知识和信仰资源。

🔗 **在线访问**: [https://shepherdloveyou.github.io/Bible/](https://shepherdloveyou.github.io/Bible/)

## ✨ 特性

- 📖 **在线圣经阅读器** — 支持多语言（中文/英文）、多版本（和合本、ESV、KJV 等），内嵌于首页
- 🎨 **Apple 风格设计系统** — 毛玻璃卡片、动画、暗色模式
- 📝 **自动博客管理** — 新增 Markdown 文件自动出现在侧边栏（按 Git 提交时间排序）
- 💬 **Giscus 评论** — 基于 GitHub Discussions 的评论系统
- 📊 **访客统计** — 基于不蒜子的访问量和访客数统计
- 🚀 **GitHub Pages 自动部署** — 推送 `main` 分支后自动构建部署

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [VitePress](https://vitepress.dev/) v1.6 | 静态站点生成 |
| [Vue 3](https://vuejs.org/) | 组件框架 (Composition API) |
| TypeScript | 配置与类型定义 |
| [Giscus](https://giscus.app/) | 评论系统 |
| [Busuanzi](https://busuanzi.ibruce.info/) | 访客统计 |
| [Bolls.life API](https://bolls.life/) | 圣经经文数据源 |

## 📁 项目结构

```
docs/
├── index.md                    # 首页（Hero + 功能卡片 + 圣经阅读器）
├── about.md                    # 关于页
├── blogs/                      # 博客文章（Markdown）
│   ├── bible-reading.md
│   ├── feasts-of-the-lord.md
│   ├── good-friday.md
│   ├── passover.md
│   ├── passover-seder.md
│   ├── pentecost.md
│   ├── resource-share.md
│   └── sunday-school-genesis.md
├── public/                     # 静态资源
└── .vitepress/
    ├── config.ts               # VitePress 配置（自动扫描博客、导航生成）
    └── theme/
        ├── Layout.vue          # 自定义布局（圣经阅读器 + Giscus）
        ├── index.ts            # 主题入口（自动注册组件）
        ├── style.css           # 全局样式与 CSS 变量
        └── components/         # Vue 组件
            ├── BibleReader.vue         # 圣经阅读器（多版本、多语言）
            ├── bible-data.ts           # 66 卷书数据（书名、章数）
            ├── AppleCard.vue           # 毛玻璃卡片
            ├── AppleButton.vue         # 交互按钮
            ├── AppleBackground.vue     # 背景效果
            ├── AppleNavEnhancement.vue # 导航栏增强
            ├── AppleNotification.vue   # 通知弹窗
            ├── AppleModal.vue          # 模态对话框
            ├── AppleSearch.vue         # 搜索界面
            ├── AppleTabs.vue           # 标签页
            ├── VisitorPanel.vue        # 访客统计面板
            └── ...                     # 更多组件
```

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/ShepherdLoveYou/Bible.git
cd Bible

# 安装依赖
pnpm install

# 启动开发服务器（自动打开浏览器）
pnpm dev

# 构建生产版本
pnpm build

# 本地预览构建产物
pnpm preview
```

### 添加新文章

在 `docs/blogs/` 目录下创建 `.md` 文件即可，侧边栏会自动生成。文件以 `# 标题` 开头：

```markdown
# 文章标题

正文内容...
```

文章按 Git 最后提交时间自动排序，最新的排在最前。

## 🌐 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署（`.github/workflows/deploy.yml`）：

1. Fork 或克隆此仓库到你的 GitHub 账号
2. 在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**
3. 推送代码到 `main` 分支，会自动触发构建和部署
4. 访问 `https://<你的用户名>.github.io/<仓库名>/`

> `base` 路径会根据仓库名自动计算，无需手动配置。如果仓库名为 `<用户名>.github.io`，则 base 为 `/`。

## 📖 圣经阅读器

内嵌在首页 Hero 区域右侧，支持：

- **中文版本**: 新标点和合本(简体)、和合本(繁體)、思高圣经
- **英文版本**: KJV、ESV、NIV、NKJV、NLT、NASB、WEB
- 66 卷书完整导航（旧约 39 卷 + 新约 27 卷）
- 章节切换、上一章/下一章快捷按钮
- 经文数据来自 [Bolls.life](https://bolls.life/) 开放 API

## 📄 License

MIT

### 内容结构
- 博客文章位于 `/docs/blogs/`，使用 `.md` 扩展名
- 图片资源存储在 `/docs/blogs/assets/` 中
- 导航配置在 `.vitepress/config.ts` 的侧边栏部分

## 开发指南

### 添加新博客文章
1. 在 `/docs/blogs/` 中创建新的 `.md` 文件
2. 添加包含标题、日期和描述的 frontmatter
3. 更新 `.vitepress/config.ts` 中的侧边栏导航

### 组件开发
- 遵循 Vue 3 组合式 API 模式
- 使用 TypeScript 进行属性定义
- 保持苹果设计语言的一致性
- 实现适当的无障碍功能

### 样式规范
- 使用 `style.css` 中定义的 CSS 自定义属性
- 遵循毛玻璃设计模式
- 确保所有屏幕尺寸的响应式设计
- 支持明暗两种主题

## 部署到 GitHub Pages（GitHub Actions）

已内置自动部署工作流：`.github/workflows/deploy.yml`。

### 一次性设置
1. 将仓库推送到 GitHub（默认分支为 `main`）。
2. 打开仓库 `Settings` -> `Pages`。
3. 在 `Build and deployment` 中将 `Source` 设为 `GitHub Actions`。

### 后续发布
- 每次推送到 `main` 分支都会自动构建并部署。
- 工作流会自动设置 `BLOG_BASE`：
  - 如果仓库是 `<username>.github.io`，则使用 `/`
  - 其他仓库使用 `/<repo-name>/`

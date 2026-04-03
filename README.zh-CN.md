<p align="right">
  <a href="./readme.md">English</a> | <strong>中文</strong>
</p>

# 福音的光 Gospel Light

一个基于 VitePress 构建的福音主题博客，致力于分享圣经真理、节期知识和信仰资源。采用 Apple 风格设计系统。

**在线访问**: <https://shepherdloveyou.github.io/Bible/>

---

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [架构设计](#架构设计)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [圣经阅读器](#圣经阅读器)
- [部署](#部署)
- [命令参考](#命令参考)
- [许可证](#许可证)

---

## 功能特性

- **在线圣经阅读器** -- 多语言（中文 / 英文）、10 个版本（CUNPS、CUV、ChiSB、KJV、ESV、NIV、NKJV、NLT、NASB、WEB），全屏阅读模式，支持搜索、字体缩放和键盘快捷键
- **Apple 风格设计系统** -- 毛玻璃卡片、光球背景动画、View Transition API 主题切换、悬浮按钮、移动端 Dock 导航
- **自动博客管理** -- 将 `.md` 文件放入 `docs/blogs/`，即可自动出现在侧边栏，按 Git 提交时间排序（最新优先）
- **Giscus 评论** -- 基于 GitHub Discussions 的评论系统
- **访客统计** -- 基于不蒜子的页面访问量和独立访客数统计
- **GitHub Pages 自动部署** -- 推送到 `main` 分支即可触发自动构建和部署

---

## 技术栈

| 技术 | 用途 |
|---|---|
| [VitePress](https://vitepress.dev/) v1.6 | 静态站点生成 |
| [Vue 3](https://vuejs.org/) | 组件框架 (Composition API) |
| TypeScript | 配置与类型定义 |
| [Giscus](https://giscus.app/) | 评论系统 |
| [Busuanzi](https://busuanzi.ibruce.info/) | 访客统计 |
| [Bolls.life API](https://bolls.life/) | 圣经经文数据源 |

---

## 项目结构

```
docs/
  index.md                          # 首页（Hero + 功能卡片 + 圣经阅读器）
  about.md                          # 关于页
  blogs/                            # 博客文章（Markdown）
    bible-reading.md
    feasts-of-the-lord.md
    good-friday.md
    passover.md
    passover-seder.md
    pentecost.md
    resource-share.md
    sunday-school-genesis.md
    assets/                         # 文章图片
  public/                           # 静态资源（favicon、SVG 图标等）
  .vitepress/
    config.ts                       # VitePress 配置（导航、侧边栏、base 路径）
    utils/
      blog.ts                       # 博客列表生成器（扫描 blogs/，按 git 时间排序）
    theme/
      index.ts                      # 主题入口（自动注册所有组件）
      Layout.vue                    # 自定义布局（插槽、Giscus、滚动处理）
      style.css                     # 全局样式与 CSS 自定义属性
      composables/
        useBibleReader.js           # 圣经阅读器核心逻辑
        useBibleSearch.js           # 全屏搜索功能
        useViewTransition.js        # 主题切换动画（View Transition API）
        useNotification.js          # Apple 风格通知管理器
      components/
        BibleReader.vue             # 圣经阅读器组件（紧凑卡片视图）
        BibleFullscreen.vue         # 全屏阅读模式（Teleport 到 body）
        bible-data.ts               # 66 卷书数据 + 版本定义
        BlogHead.vue                # 文章头部（作者、日期）
        VisitorPanel.vue            # 访客统计面板
        backTop.vue                 # 返回顶部按钮
        AppleBackground.vue         # 光球动画背景
        AppleButton.vue             # 样式按钮
        AppleCard.vue               # 毛玻璃卡片
        AppleFloatingActionButton.vue  # 悬浮动作按钮
        AppleLoadingSpinner.vue     # 加载动画
        AppleModal.vue              # 模态对话框
        AppleNavEnhancement.vue     # 移动端 Dock 导航
        AppleNotification.vue       # 通知吐司
        AppleProgressBar.vue        # 进度条
        AppleSearch.vue             # 搜索界面
        AppleTabs.vue               # 标签页组件
        AppleTooltip.vue            # 工具提示
.github/
  workflows/
    deploy.yml                      # GitHub Pages CI/CD 流水线
```

---

## 架构设计

项目遵循**低耦合、高内聚**架构原则。业务逻辑提取到 composable，UI 拆分为聚焦组件，构建时工具与运行时代码隔离。

### 模块依赖图

```
config.ts
  +-- utils/blog.ts            （构建时博客列表生成）

Layout.vue
  +-- useViewTransition.js     （主题切换动画）
  +-- Giscus                   （评论系统，通过 @giscus/vue）
  +-- [所有组件]                （自动注册，在模板插槽中使用）

BibleReader.vue
  +-- useBibleReader.js        （版本/书卷/章节状态 + API 调用）
  +-- BibleFullscreen.vue      （全屏子组件）
        +-- useBibleSearch.js  （搜索状态 + 文本高亮）
  +-- bible-data.ts            （静态书卷数据 + 版本元数据）
```

### 组合式函数 (Composables)

每个 composable 封装单一职责，返回响应式状态和方法。

| Composable | 职责 | 输入 | 主要导出 |
|---|---|---|---|
| `useBibleReader()` | 圣经阅读核心逻辑 | 无 | `selectedVersion`, `selectedBookIndex`, `selectedChapter`, `verses`, `loading`, `error`, `isChinese`, `loadChapter()`, `prevChapter()`, `nextChapter()` |
| `useBibleSearch(verses)` | 全屏文本搜索 | `Ref<Array>` 经文数组 | `searchQuery`, `searchMatches`, `toggleSearch()`, `onSearch()`, `highlightText()`, `isSearchHighlight()` |
| `useViewTransition()` | 主题切换波纹动画 | 无 | `isDark`（同时通过 Vue inject 提供 `toggle-appearance`） |
| `useNotification()` | 全局通知管理 | 无 | `$notify.show()`, `$notify.success()`, `$notify.error()` 等 |

### 组件自动注册

`theme/components/` 下的所有 `.vue` 文件通过 `theme/index.ts` 中的 `import.meta.glob` 自动注册为全局组件。文件名即为组件名。无需手动调用 `app.component()` -- 只需创建 `.vue` 文件即可在任意模板中使用。

```ts
// theme/index.ts
const modules = import.meta.glob("./components/*.vue", { eager: true })
for (const path in modules) {
  const componentName = path.match(/\/([^/]+)\.vue$/)?.[1]
  if (componentName) app.component(componentName, modules[path].default)
}
```

### 布局插槽映射

自定义 `Layout.vue` 将组件注入 VitePress 默认主题插槽：

| 插槽 | 内容 | 可见性 |
|---|---|---|
| `#home-hero-image` | `BibleReader`（紧凑卡片） | 仅桌面端 |
| `#home-features-before` | `BibleReader`（紧凑卡片） | 仅移动端 |
| `#doc-after` | `Giscus` 评论组件 | 文章页面 |

全局覆盖层（`AppleBackground`、`AppleNavEnhancement`、`AppleFloatingActionButton`）在 Layout 插槽外部渲染。

### 数据流：圣经阅读器

```
用户选择版本/书卷/章节
        |
        v
useBibleReader.js
  - 更新响应式引用（selectedVersion, selectedBookIndex, selectedChapter）
  - 调用 bolls.life API: GET /get-chapter/{version}/{bookIndex}/{chapter}
  - 填充 verses 引用
        |
        v
BibleReader.vue（紧凑视图）
  - 渲染经文列表、导航控件
  - 点击"全屏"打开 BibleFullscreen
        |
        v
BibleFullscreen.vue（Teleport 到 body）
  - 通过 props 接收状态，通过 emit 返回更新
  - 初始化 useBibleSearch(verses) 用于搜索覆盖层
  - 支持键盘快捷键：Esc（关闭）、Left/Right（导航）、Ctrl+F（搜索）
```

### 构建时博客生成

`utils/blog.ts` 在构建时（Node.js）运行，扫描 `docs/blogs/` 并生成侧边栏：

1. `readdirSync` 列出 `docs/blogs/` 中的所有 `.md` 文件
2. 读取每个文件内容，提取第一个 `# 标题` 作为显示名称
3. `git log -1 --format=%at` 获取每个文件的最后提交时间戳
4. 文章按提交时间降序排列（最新优先）
5. 未跟踪的（新）文件获得 `Date.now()` 作为时间戳，因此排在最前

结果由 `config.ts` 消费，注入到 `themeConfig.sidebar` 和 `themeConfig.nav`。

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8（或 npm 作为后备）

### 安装与运行

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

如果 pnpm 不可用，可以用 `npm install` / `npm run dev` / `npm run build` 代替。

---

## 开发指南

### 添加新博客文章

1. 在 `docs/blogs/` 中创建 `.md` 文件：

```markdown
# 文章标题

文章内容。支持标准 Markdown 语法。

## 章节标题

更多内容...
```

2. 完成。无需修改任何配置。构建系统会：
   - 自动检测新文件
   - 提取 `# 标题` 作为侧边栏显示名称
   - 按最新 git 提交时间排序到侧边栏顶部
   - 将首页 Hero 按钮链接到最新文章

3. 提交并推送到 `main` 分支即可触发部署。

### 添加新组件

1. 在 `docs/.vitepress/theme/components/` 中创建 `.vue` 文件：

```vue
<template>
  <div class="my-widget">...</div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.my-widget { /* 样式 */ }
</style>
```

2. 在任意 Markdown 文件或 Vue 模板中按文件名使用：

```markdown
<!-- 在任意 .md 文件中 -->
<MyWidget />
```

无需导入或注册 -- `theme/index.ts` 中的自动注册机制会处理。

### 添加新 Composable

1. 在 `docs/.vitepress/theme/composables/` 中创建 `.js` 或 `.ts` 文件：

```js
import { ref, computed } from 'vue'

export function useMyFeature() {
  const state = ref(null)
  // ... 逻辑
  return { state }
}
```

2. 在任意组件中导入使用：

```vue
<script setup>
import { useMyFeature } from '../composables/useMyFeature'
const { state } = useMyFeature()
</script>
```

### 修改布局

`Layout.vue` 使用 VitePress 默认主题插槽。可用插槽包括：

- `#home-hero-image` -- 首页 Hero 区域右侧
- `#home-features-before` -- 功能网格之前
- `#doc-before` / `#doc-after` -- 文章内容前/后
- `#nav-bar-content-after` -- 导航栏之后

完整列表请参考 [VitePress 布局插槽文档](https://vitepress.dev/guide/extending-default-theme#layout-slots)。

### 样式规范

- 全局 CSS 自定义属性定义在 `theme/style.css` 中
- 组件中使用 `scoped` 样式避免泄漏
- 暗色模式由 VitePress 内置的 `<html>` 上的 `.dark` 类处理
- Apple 设计系统组件（`Apple*.vue`）共享一致的毛玻璃和动画风格

### 环境变量

| 变量 | 用途 | 默认值 |
|---|---|---|
| `BLOG_BASE` | 覆盖 VitePress 的 `base` 路径用于部署 | `/`（CI 中自动检测） |

---

## 圣经阅读器

圣经阅读器嵌入在首页 Hero 区域（桌面端）和功能区域上方（移动端）。

### 支持的版本

**中文（3 个）**：
- CUNPS -- 新标点和合本（简体）
- CUV -- 和合本（繁体）
- ChiSB -- 思高圣经

**英文（7 个）**：
- KJV -- King James Version
- ESV -- English Standard Version
- NIV -- New International Version
- NKJV -- New King James Version
- NLT -- New Living Translation
- NASB -- New American Standard Bible
- WEB -- World English Bible

### 导航

- 66 卷书按旧约（39 卷）和新约（27 卷）分组
- 书卷名称根据所选版本显示中文或英文
- 通过下拉框或上一章/下一章按钮导航章节
- 默认：CUNPS，约翰福音，第一章

### 全屏模式

- 通过紧凑阅读器上的扩展按钮进入
- 键盘快捷键：
  - `Esc` -- 关闭全屏
  - `Left Arrow` -- 上一章
  - `Right Arrow` -- 下一章
  - `Ctrl+F` / `Cmd+F` -- 切换搜索
- 字体大小可从 12px 到 32px 调节
- Page Up / Page Down 用于滚动
- 搜索高亮匹配经文，支持在结果间导航

### API

经文数据来自 [Bolls.life](https://bolls.life/) 公共 API：

```
GET https://bolls.life/get-chapter/{version}/{bookIndex}/{chapter}/
```

返回经文对象数组：`{ pk, verse, text }`。

---

## 部署

### GitHub Pages（自动）

仓库包含 `.github/workflows/deploy.yml`，每次推送到 `main` 时运行：

1. 检出仓库（包含完整 git 历史用于博客排序）
2. 设置 pnpm v8.14.0 和 Node.js 20
3. 自动检测 `base` 路径：
   - `<用户名>.github.io` 仓库使用 `/`
   - 其他仓库使用 `/<仓库名>/`
4. 运行 `pnpm install` 和 `pnpm run build`
5. 上传 `docs/.vitepress/dist` 作为 GitHub Pages 构建物
6. 部署到 GitHub Pages

**设置**：前往仓库 Settings -> Pages -> Source -> 选择 "GitHub Actions"。

### 手动部署

```bash
# 使用自定义 base 路径构建
BLOG_BASE=/my-blog/ pnpm build

# 输出在 docs/.vitepress/dist/
# 上传到任意静态托管服务
```

---

## 命令参考

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器，支持热重载（自动打开浏览器） |
| `pnpm build` | 构建生产站点到 `docs/.vitepress/dist/` |
| `pnpm preview` | 本地预览生产构建产物 |

---

## 许可证

MIT

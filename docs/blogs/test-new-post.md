# 项目概览 Project Overview

福音的光 (Gospel Light) — 基于 VitePress 的福音博客，采用 Apple 风格设计系统。

A VitePress-based gospel blog with an Apple-inspired design system.

## 功能亮点 Features

- ✅ **19 个圣经版本，15 种语言** — 中文、英文、韩语、西班牙语、法语、德语、葡萄牙语、俄语、阿拉伯语、希腊语、越南语、芬兰语、罗马尼亚语、世界语
- ✅ **完全离线** — 本地 JSON 数据（来源 [thiagobodruk/bible](https://github.com/thiagobodruk/bible)），运行时无需外部 API
- ✅ **多语言 UI** — 书卷名、章节标签、旧约/新约分组名自动切换为对应语言（14 种语言）
- ✅ **全屏阅读** — 键盘快捷键（Esc / ←→ / Ctrl+F）、字体缩放、搜索高亮
- ✅ **自动博客管理** — 放入 `.md` 文件即自动出现在侧边栏，按 Git 提交时间排序
- ✅ **Apple 设计系统** — 毛玻璃卡片、光球动画、View Transition 主题切换、Dock 导航

## 架构设计 Architecture

遵循**低耦合、高内聚**原则：

### 组合式函数 Composables

| 模块 | 职责 |
|------|------|
| `useBibleReader` | 圣经阅读核心逻辑（本地 JSON 加载 + 书卷级缓存） |
| `useBibleSearch` | 全屏搜索（响应式 computed 引用） |
| `useViewTransition` | 主题切换波纹动画 |
| `useNotification` | Apple 风格全局通知 |

### 组件拆分 Components

- `BibleReader.vue` — 紧凑卡片视图（首页嵌入）
- `BibleFullscreen.vue` — 全屏阅读模式（Teleport to body）
- `bible-data.ts` — 66 书卷 × 14 语言名称 + 版本元数据
- `Apple*.vue` — 设计系统组件（Background / Card / FAB / Nav / Modal 等）

### 数据流 Data Flow

```
用户选择版本/书卷/章节
  → useBibleReader 从 /bible/{version}/{bookId}.json 加载
  → 缓存整卷书（Map key: "version-bookId"）
  → 提取章节填充 verses
  → BibleReader 渲染 → BibleFullscreen 全屏
```

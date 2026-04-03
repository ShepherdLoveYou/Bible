# 测试博文 Test Blog Post

这是一篇用于测试博客创建功能的文章。

This is a test blog post to verify the blog creation feature works correctly.

## 功能验证 Feature Verification

- ✅ 博文自动出现在侧边栏
- ✅ 标题从 Markdown `# 标题` 自动提取
- ✅ 按 Git 提交时间排序（最新优先）

## 项目优化总结 Project Optimization Summary

本次优化遵循**低耦合、高内聚**原则，对项目进行了以下重构：

### 组合式函数提取 Composables Extraction

| 模块 | 职责 |
|------|------|
| `useBibleReader` | 圣经阅读器核心逻辑 |
| `useBibleSearch` | 全屏搜索功能 |
| `useViewTransition` | 主题切换动画 |

### 组件拆分 Component Splitting

- `BibleReader.vue` — 主阅读器（精简后约 350 行）
- `BibleFullscreen.vue` — 全屏阅读模式子组件

### 工具函数提取 Utility Extraction

- `utils/blog.ts` — 博客列表自动生成
- `bible-data.ts` — 圣经版本数据统一管理

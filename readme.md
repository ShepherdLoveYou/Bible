<p align="right">
  <strong>English</strong> | <a href="./README.zh-CN.md">中文</a>
</p>

# Gospel Light -- Fu Yin De Guang

A VitePress-based gospel blog dedicated to sharing biblical truth, feast knowledge, and faith resources through an Apple-inspired design system.

**Online**: <https://shepherdloveyou.github.io/Bible/>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Bible Reader](#bible-reader)
- [Deployment](#deployment)
- [Scripts Reference](#scripts-reference)
- [License](#license)

---

## Features

- **Online Bible Reader** -- Multi-language (Chinese / English), 10 versions (CUNPS, CUV, ChiSB, KJV, ESV, NIV, NKJV, NLT, NASB, WEB), fullscreen reading mode with search, font scaling, and keyboard shortcuts
- **Apple-style Design System** -- Frosted glass cards, orb background animation, smooth View Transition API theme toggle, floating action button, mobile dock navigation
- **Automatic Blog Management** -- Drop a `.md` file into `docs/blogs/`, and it appears in the sidebar automatically, sorted by git commit time (newest first)
- **Giscus Comments** -- GitHub Discussions-based comment system on every article page
- **Visitor Analytics** -- Busuanzi-based page view and unique visitor counters
- **GitHub Pages CI/CD** -- Push to `main` triggers automatic build and deployment via GitHub Actions

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [VitePress](https://vitepress.dev/) v1.6 | Static site generator |
| [Vue 3](https://vuejs.org/) | Component framework (Composition API) |
| TypeScript | Configuration and type definitions |
| [Giscus](https://giscus.app/) | Comment system |
| [Busuanzi](https://busuanzi.ibruce.info/) | Visitor analytics |
| [Bolls.life API](https://bolls.life/) | Bible verse data source |

---

## Project Structure

```
docs/
  index.md                          # Homepage (Hero + feature cards + Bible reader)
  about.md                          # About page
  blogs/                            # Blog articles (Markdown)
    bible-reading.md
    feasts-of-the-lord.md
    good-friday.md
    passover.md
    passover-seder.md
    pentecost.md
    resource-share.md
    sunday-school-genesis.md
    assets/                         # Article images
  public/                           # Static assets (favicon, SVG icons, etc.)
  .vitepress/
    config.ts                       # VitePress config (nav, sidebar, base path)
    utils/
      blog.ts                       # Blog list generator (scans blogs/, sorts by git time)
    theme/
      index.ts                      # Theme entry (auto-registers all components)
      Layout.vue                    # Custom layout (slots, Giscus, scroll handler)
      style.css                     # Global styles and CSS custom properties
      composables/
        useBibleReader.js           # Bible reader core logic
        useBibleSearch.js           # Fullscreen search functionality
        useViewTransition.js        # Theme toggle animation (View Transition API)
        useNotification.js          # Apple-style notification manager
      components/
        BibleReader.vue             # Bible reader widget (compact card view)
        BibleFullscreen.vue         # Fullscreen reading mode (Teleport to body)
        bible-data.ts               # 66 books data + version definitions
        BlogHead.vue                # Article header (author, date)
        VisitorPanel.vue            # Visitor statistics panel
        backTop.vue                 # Back to top button
        AppleBackground.vue         # Animated orb background
        AppleButton.vue             # Styled button
        AppleCard.vue               # Frosted glass card
        AppleFloatingActionButton.vue  # Floating action button
        AppleLoadingSpinner.vue     # Loading spinner
        AppleModal.vue              # Modal dialog
        AppleNavEnhancement.vue     # Mobile dock navigation
        AppleNotification.vue       # Notification toast
        AppleProgressBar.vue        # Progress bar
        AppleSearch.vue             # Search interface
        AppleTabs.vue               # Tab component
        AppleTooltip.vue            # Tooltip
.github/
  workflows/
    deploy.yml                      # GitHub Pages CI/CD pipeline
```

---

## Architecture

The project follows a **low coupling, high cohesion** architecture. Business logic is extracted into composables, UI is split into focused components, and build-time utilities are isolated from runtime code.

### Module Dependency Graph

```
config.ts
  +-- utils/blog.ts            (build-time blog list generation)

Layout.vue
  +-- useViewTransition.js     (theme toggle animation)
  +-- Giscus                   (comment system, via @giscus/vue)
  +-- [all components]         (auto-registered, used in template slots)

BibleReader.vue
  +-- useBibleReader.js        (version/book/chapter state + API calls)
  +-- BibleFullscreen.vue      (fullscreen sub-component)
        +-- useBibleSearch.js  (search state + text highlighting)
  +-- bible-data.ts            (static book data + version metadata)
```

### Composables

Each composable encapsulates a single concern and returns reactive state plus methods.

| Composable | Responsibility | Input | Key Exports |
|---|---|---|---|
| `useBibleReader()` | Bible reading core logic | None | `selectedVersion`, `selectedBookIndex`, `selectedChapter`, `verses`, `loading`, `error`, `isChinese`, `loadChapter()`, `prevChapter()`, `nextChapter()` |
| `useBibleSearch(verses)` | Fullscreen text search | `Ref<Array>` of verses | `searchQuery`, `searchMatches`, `toggleSearch()`, `onSearch()`, `highlightText()`, `isSearchHighlight()` |
| `useViewTransition()` | Theme toggle with ripple animation | None | `isDark` (also provides `toggle-appearance` via Vue inject) |
| `useNotification()` | Global notification management | None | `$notify.show()`, `$notify.success()`, `$notify.error()`, etc. |

### Component Auto-Registration

All `.vue` files under `theme/components/` are automatically registered as global components via `import.meta.glob` in `theme/index.ts`. The filename becomes the component name. No manual `app.component()` calls are needed -- just create a `.vue` file and use it in any template.

```ts
// theme/index.ts
const modules = import.meta.glob("./components/*.vue", { eager: true })
for (const path in modules) {
  const componentName = path.match(/\/([^/]+)\.vue$/)?.[1]
  if (componentName) app.component(componentName, modules[path].default)
}
```

### Layout Slot Mapping

The custom `Layout.vue` injects components into VitePress default theme slots:

| Slot | Content | Visibility |
|---|---|---|
| `#home-hero-image` | `BibleReader` (compact card) | Desktop only |
| `#home-features-before` | `BibleReader` (compact card) | Mobile only |
| `#doc-after` | `Giscus` comment widget | Article pages |

Global overlays (`AppleBackground`, `AppleNavEnhancement`, `AppleFloatingActionButton`) render outside the Layout slots.

### Data Flow: Bible Reader

```
User selects version/book/chapter
        |
        v
useBibleReader.js
  - Updates reactive refs (selectedVersion, selectedBookIndex, selectedChapter)
  - Calls bolls.life API: GET /get-chapter/{version}/{bookIndex}/{chapter}
  - Populates verses ref
        |
        v
BibleReader.vue (compact view)
  - Renders verse list, navigation controls
  - On "fullscreen" click, opens BibleFullscreen
        |
        v
BibleFullscreen.vue (Teleport to body)
  - Receives state via props, emits updates back
  - Initializes useBibleSearch(verses) for search overlay
  - Supports keyboard shortcuts: Esc (close), Left/Right (navigate), Ctrl+F (search)
```

### Build-Time Blog Generation

`utils/blog.ts` runs at build time (Node.js) to scan `docs/blogs/` and produce the sidebar:

1. `readdirSync` lists all `.md` files in `docs/blogs/`
2. Each file's content is read; the first `# Heading` is extracted as the display title
3. `git log -1 --format=%at` retrieves the last commit timestamp for each file
4. Articles are sorted by commit time descending (newest first)
5. Untracked (new) files get `Date.now()` as their timestamp, so they appear at the top

The result is consumed by `config.ts` which injects it into `themeConfig.sidebar` and `themeConfig.nav`.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8 (or npm as fallback)

### Install and Run

```bash
# Clone the repository
git clone https://github.com/ShepherdLoveYou/Bible.git
cd Bible

# Install dependencies
pnpm install

# Start the development server (opens browser automatically)
pnpm dev

# Build for production
pnpm build

# Preview the production build locally
pnpm preview
```

If pnpm is unavailable, substitute with `npm install` / `npm run dev` / `npm run build`.

---

## Development Guide

### Adding a New Blog Post

1. Create a `.md` file in `docs/blogs/`:

```markdown
# Your Article Title

Article content goes here. Standard Markdown syntax is supported.

## Section Heading

More content...
```

2. That is it. No configuration changes are needed. The build system will:
   - Detect the new file automatically
   - Extract the `# Title` as the sidebar display name
   - Sort it to the top of the sidebar (newest git commit first)
   - Link the homepage hero button to the latest article

3. Commit and push to `main` to trigger deployment.

### Adding a New Component

1. Create a `.vue` file in `docs/.vitepress/theme/components/`:

```vue
<template>
  <div class="my-widget">...</div>
</template>

<script setup>
// Component logic
</script>

<style scoped>
.my-widget { /* styles */ }
</style>
```

2. Use it in any Markdown file or Vue template by its filename:

```markdown
<!-- In any .md file -->
<MyWidget />
```

No import or registration is needed -- the auto-registration in `theme/index.ts` handles it.

### Adding a New Composable

1. Create a `.js` or `.ts` file in `docs/.vitepress/theme/composables/`:

```js
import { ref, computed } from 'vue'

export function useMyFeature() {
  const state = ref(null)
  // ... logic
  return { state }
}
```

2. Import and use in any component:

```vue
<script setup>
import { useMyFeature } from '../composables/useMyFeature'
const { state } = useMyFeature()
</script>
```

### Modifying the Layout

`Layout.vue` uses VitePress default theme slots. Available slots include:

- `#home-hero-image` -- Right side of the homepage hero section
- `#home-features-before` -- Before the features grid
- `#doc-before` / `#doc-after` -- Before/after article content
- `#nav-bar-content-after` -- After the navigation bar

See the [VitePress Layout Slots documentation](https://vitepress.dev/guide/extending-default-theme#layout-slots) for the full list.

### Styling Conventions

- Global CSS custom properties are defined in `theme/style.css`
- Use `scoped` styles in components to avoid leaking
- Dark mode is handled by VitePress built-in `.dark` class on `<html>`
- The Apple design system components (`Apple*.vue`) share consistent frosted glass and animation patterns

### Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `BLOG_BASE` | Override the VitePress `base` path for deployment | `/` (auto-detected in CI) |

---

## Bible Reader

The Bible reader is embedded in the homepage hero area (desktop) and above the features section (mobile).

### Supported Versions

**Chinese (3)**:
- CUNPS -- Xin Biao Dian He He Ben (Simplified)
- CUV -- He He Ben (Traditional)
- ChiSB -- Si Gao Sheng Jing

**English (7)**:
- KJV -- King James Version
- ESV -- English Standard Version
- NIV -- New International Version
- NKJV -- New King James Version
- NLT -- New Living Translation
- NASB -- New American Standard Bible
- WEB -- World English Bible

### Navigation

- 66 books organized into Old Testament (39) and New Testament (27)
- Book names display in Chinese or English based on the selected version
- Chapter navigation via dropdown or previous/next buttons
- Default: CUNPS, Gospel of John, Chapter 1

### Fullscreen Mode

- Enter via the expand button on the compact reader
- Keyboard shortcuts:
  - `Esc` -- Close fullscreen
  - `Left Arrow` -- Previous chapter
  - `Right Arrow` -- Next chapter
  - `Ctrl+F` / `Cmd+F` -- Toggle search
- Font size adjustable from 12px to 32px
- Page Up / Page Down for scrolling
- Search highlights matching verses with navigation between results

### API

Verse data is fetched from the [Bolls.life](https://bolls.life/) public API:

```
GET https://bolls.life/get-chapter/{version}/{bookIndex}/{chapter}/
```

Returns an array of verse objects: `{ pk, verse, text }`.

---

## Deployment

### GitHub Pages (Automatic)

The repository includes `.github/workflows/deploy.yml` that runs on every push to `main`:

1. Checks out the repository (with full git history for blog sorting)
2. Sets up pnpm v8.14.0 and Node.js 20
3. Auto-detects the `base` path:
   - `<username>.github.io` repos use `/`
   - Other repos use `/<repo-name>/`
4. Runs `pnpm install` and `pnpm run build`
5. Uploads `docs/.vitepress/dist` as a GitHub Pages artifact
6. Deploys to GitHub Pages

**Setup**: Go to repository Settings -> Pages -> Source -> select "GitHub Actions".

### Manual Deployment

```bash
# Build with a custom base path
BLOG_BASE=/my-blog/ pnpm build

# The output is in docs/.vitepress/dist/
# Upload to any static hosting service
```

---

## Scripts Reference

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload (auto-opens browser) |
| `pnpm build` | Build production site to `docs/.vitepress/dist/` |
| `pnpm preview` | Preview the production build locally |

---

## License

MIT

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

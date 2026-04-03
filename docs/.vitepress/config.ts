import { defineConfig } from "vitepress"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { execSync } from "node:child_process"

interface BlogItem {
  text: string
  link: string
}

/**
 * 获取文件的 git 最后提交时间（毫秒时间戳）
 * 如果文件未被 git 跟踪（新文件未提交），则返回 Date.now() 使其排到最前
 */
function getGitLastModified(filePath: string): number {
  try {
    const timestamp = execSync(`git log -1 --format=%at "${filePath}"`, { encoding: "utf-8" }).trim()
    return timestamp ? Number(timestamp) * 1000 : Date.now()
  } catch {
    return Date.now()
  }
}

/**
 * 自动扫描 blogs 目录，读取标题并按 git 提交时间降序排列
 * 新增或修改的博客会自动排到侧边栏首位
 */
function generateBlogList(): BlogItem[] {
  const blogsDir = resolve(process.cwd(), "docs/blogs")
  const files = readdirSync(blogsDir).filter((f) => f.endsWith(".md"))

  const blogs = files.map((file) => {
    const filePath = resolve(blogsDir, file)
    const content = readFileSync(filePath, "utf-8")
    const gitTime = getGitLastModified(filePath)

    // 提取第一个 # 标题作为侧边栏显示文本
    const match = content.match(/^#\s+(.+)$/m)
    const title = match ? match[1].trim() : file.replace(".md", "")
    const name = file.replace(".md", "")

    return { text: title, link: `/blogs/${name}`, mtime: gitTime }
  })

  // 按 git 提交时间降序排列（最新提交的排最前）
  blogs.sort((a, b) => b.mtime - a.mtime)

  return blogs.map(({ text, link }) => ({ text, link }))
}

const mdList = generateBlogList()

export default defineConfig({
  title: "福音的光 Gospel Light",
  titleTemplate: "Gospel Light",
  description: "將希望和真理帶到每一個角落 - Bringing hope and truth to every corner",
  ignoreDeadLinks: true,
  // header标签里面插入的内容
  head: [["link", { rel: "icon", href: "/cross.svg" }]],
  //启用深色模式
  appearance: "dark",
  themeConfig: {
    // 网站的logo
    logo: "/cross.svg",
    // 文章右侧大纲目录
    outline: {
      level: [2, 6],
      label: "目录",
    },
    //自定义上下页名
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // 主题切换文字
    darkModeSwitchTitle: "切换到深色模式",
    lightModeSwitchTitle: "切换到浅色模式",
    // 返回顶部label文字
    returnToTopLabel: "返回顶部",
    // 搜索
    // search: {
    //   provider: "local",
    // },
    // 页脚
    footer: {
      message: "将希望和真理带到每一个角落",
      copyright: "Copyright © 2026 Gospel Light ✝",
    },
    // 文档的最后更新时间
    lastUpdatedText: "最后更新于",
    // 文档的更新时间
    lastUpdated: {
      text: "时间",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "medium",
      },
    },
    // 导航栏按钮
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: mdList[0].link },
      { text: "关于", link: "/about" },
    ],
    // 侧边栏
    sidebar: [
      {
        text: "文章",
        items: mdList,
      },
    ],
    // 社交链接
    socialLinks: [],
    // 404找不到页面
    notFound: {
      title: "抱歉，您访问的资源不存在",
      quote: "该页面可能已被移动或删除。你可以返回首页继续浏览。",
      linkText: "返回首页",
    },
  },
  // 部署的时候需要注意该参数避免样式丢失
  // 本地默认 /，部署到子路径时可通过 BLOG_BASE 覆盖，例如 /my-blog/
  base: process.env.BLOG_BASE || "/",

  // 构建时自动将首页 hero 按钮链接指向最新博客
  transformPageData(pageData) {
    if (pageData.relativePath === "index.md" && mdList.length > 0) {
      const latestLink = mdList[0].link
      const actions = pageData.frontmatter?.hero?.actions
      if (Array.isArray(actions)) {
        actions.forEach((action: any) => {
          if (action.link?.startsWith("/blogs/")) {
            action.link = latestLink
          }
        })
      }
    }
  },
})

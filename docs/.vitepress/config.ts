import { defineConfig } from "vitepress"
import { generateBlogList } from "./utils/blog"

const mdList = generateBlogList()

export default defineConfig({
  title: "福音的光 Gospel Light",
  titleTemplate: "Gospel Light",
  description: "將希望和真理帶到每一個角落 - Bringing hope and truth to every corner",
  ignoreDeadLinks: true,
  // header标签里面插入的内容
  head: [["link", { rel: "icon", href: "/bible.svg" }]],
  //启用深色模式
  appearance: "dark",
  themeConfig: {
    // 网站的logo
    logo: "/bible.svg",
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

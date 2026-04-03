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
export function generateBlogList(): BlogItem[] {
  const blogsDir = resolve(process.cwd(), "docs/blogs")
  const files = readdirSync(blogsDir).filter((f) => f.endsWith(".md"))

  const blogs = files.map((file) => {
    const filePath = resolve(blogsDir, file)
    const content = readFileSync(filePath, "utf-8")
    const gitTime = getGitLastModified(filePath)

    const match = content.match(/^#\s+(.+)$/m)
    const title = match ? match[1].trim() : file.replace(".md", "")
    const name = file.replace(".md", "")

    return { text: title, link: `/blogs/${name}`, mtime: gitTime }
  })

  blogs.sort((a, b) => b.mtime - a.mtime)
  return blogs.map(({ text, link }) => ({ text, link }))
}

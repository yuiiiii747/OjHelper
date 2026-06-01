/**
 * 将 API 返回的 Markdown 解析为结构化 Result
 * 支持 PRD 定义的各模式输出层结构
 */

/**
 * 从 Markdown 文本中提取指定标题下的内容
 */
function extractSection(markdown, title) {
  const regex = new RegExp(`^#+\\s*${title}\\s*$([\\s\\S]*?)(?=^#+\\s|\\z)`, 'm')
  const match = markdown.match(regex)
  if (!match) return null

  const body = match[1].trim()
  const lines = body.split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
  return lines
}

/**
 * 从 Markdown 中提取第一个代码块
 */
function extractCode(markdown) {
  const match = markdown.match(/```[\w]*\n([\s\S]*?)```/)
  return match ? match[1].trim() : null
}

/**
 * 通用解析：将 Markdown 按标题拆分为 sections
 */
export function parseResult(markdown, mode) {
  if (!markdown) return null

  const lines = markdown.split('\n')
  const sections = []
  let currentSection = null
  let code = null
  let codeStarted = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 检测代码块开始/结束
    if (line.startsWith('```')) {
      if (!codeStarted) {
        codeStarted = true
        let codeLines = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        code = codeLines.join('\n').trim()
        codeStarted = false
        continue
      }
    }

    // 检测 Markdown 标题
    const headerMatch = line.match(/^#{1,3}\s+(.+)/)
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        title: headerMatch[1].trim(),
        icon: getIconForTitle(headerMatch[1].trim(), mode),
        content: [],
      }
      continue
    }

    // 列表项或普通文本
    if (currentSection) {
      const trimmed = line.replace(/^[-*]\s+/, '').trim()
      if (trimmed) {
        currentSection.content.push(trimmed)
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  const titleMap = {
    explain: '题目分析结果',
    debug: '代码纠错报告',
    review: '复习计划',
  }

  return {
    type: mode,
    title: titleMap[mode] || '分析结果',
    sections,
    code,
    raw: markdown,
  }
}

function getIconForTitle(title, mode) {
  const iconMap = {
    '数据范围分析': '📊',
    '考点分析': '🎯',
    '涉及思路': '💡',
    '可用算法对比': '⚡',
    '易错点总结': '⚠️',
    '代码实现': '💻',
    '错误结论': '🔍',
    '代码想法识别': '🤔',
    '构造反例': '🧪',
    '修改方案': '🛠️',
    '错题沉淀': '📌',
    '错题统计': '📊',
    '错因归类': '📋',
    '掌握度判断': '🎯',
    '复习优先级排序': '🔢',
    '今日复习建议': '💡',
  }

  // 模糊匹配
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon
  }

  return '📄'
}

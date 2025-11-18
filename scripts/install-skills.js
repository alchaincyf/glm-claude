#!/usr/bin/env node

/**
 * GLM Code Skills 安装脚本
 * 自动将预装的写作和视频创作 Skills 安装到用户的 Claude Code 目录
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

// Skills 列表
const SKILLS = [
  'ai-proofreading',
  'image-generation',
  'personal-material-search',
  'video-thumbnail-check',
  'video-script-collaborial',
  'prompt-classifier',
  'topic-generation',
  'article-to-x',
  'video-outline-generation',
  'info-search-knowledge'
]

// 日志工具
const log = {
  info: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  success: (msg) => console.log(`🎉 ${msg}`)
}

// 检查目录是否存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return true
  }
  return false
}

// 复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    log.error(`源目录不存在: ${src}`)
    return false
  }

  // 创建目标目录
  ensureDir(dest)

  // 复制所有文件
  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }

  return true
}

// 主安装函数
async function installSkills() {
  log.info('开始安装 GLM Code Skills...')

  // 获取用户主目录
  const homeDir = os.homedir()

  // Claude Code 的 skills 目录
  const claudeSkillsDir = path.join(homeDir, '.claude', 'skills')

  // 当前项目中的 skills 目录
  const projectSkillsDir = path.join(__dirname, '..', 'skills')

  try {
    // 检查项目 skills 目录是否存在
    if (!fs.existsSync(projectSkillsDir)) {
      log.error('项目中的 skills 目录不存在')
      process.exit(1)
    }

    // 创建 Claude Code skills 目录
    const created = ensureDir(claudeSkillsDir)
    if (created) {
      log.info(`创建 Claude Code skills 目录: ${claudeSkillsDir}`)
    }

    // 安装每个 skill
    let successCount = 0
    for (const skillName of SKILLS) {
      const srcSkillDir = path.join(projectSkillsDir, skillName)
      const destSkillDir = path.join(claudeSkillsDir, skillName)

      if (copyDir(srcSkillDir, destSkillDir)) {
        log.info(`安装技能: ${skillName}`)
        successCount++
      } else {
        log.warn(`跳过技能: ${skillName} (源目录不存在)`)
      }
    }

    // 复制 README.md
    const readmeSrc = path.join(projectSkillsDir, 'README.md')
    const readmeDest = path.join(claudeSkillsDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      fs.copyFileSync(readmeSrc, readmeDest)
      log.info('复制 Skills 说明文档')
    }

    log.success(`Skills 安装完成!`)
    log.info(`成功安装 ${successCount}/${SKILLS.length} 个技能`)
    log.info(`安装路径: ${claudeSkillsDir}`)

    // 显示已安装的技能列表
    log.info('已安装的技能:')
    SKILLS.forEach(skill => {
      const skillPath = path.join(claudeSkillsDir, skill)
      if (fs.existsSync(skillPath)) {
        const skillFile = path.join(skillPath, 'SKILL.md')
        if (fs.existsSync(skillFile)) {
          const content = fs.readFileSync(skillFile, 'utf8')
          const nameMatch = content.match(/name:\s*(.+)/)
          const descMatch = content.match(/description:\s*(.+)/)
          const name = nameMatch ? nameMatch[1].trim() : skill
          const desc = descMatch ? descMatch[1].trim().substring(0, 50) + '...' : ''
          console.log(`  • ${name} - ${desc}`)
        }
      }
    })

    log.success('现在你可以使用 GLM Code 享受这些专业能力了!')

  } catch (error) {
    log.error(`安装失败: ${error.message}`)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  installSkills()
}

module.exports = { installSkills }
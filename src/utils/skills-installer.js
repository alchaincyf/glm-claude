/**
 * Skills 安装工具
 * 自动安装 GLM Code 的预装 Skills
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const Logger = require('./logger')

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

/**
 * 检查目录是否存在，不存在则创建
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return true
  }
  return false
}

/**
 * 复制文件或目录
 */
function copyFile(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    // 如果是目录，递归复制
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    const files = fs.readdirSync(src)
    for (const file of files) {
      copyFile(path.join(src, file), path.join(dest, file))
    }
  } else {
    // 如果是文件，直接复制
    fs.copyFileSync(src, dest)
  }
}

/**
 * 检查 Skills 是否已安装
 */
function areSkillsInstalled() {
  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills')

  if (!fs.existsSync(claudeSkillsDir)) {
    return false
  }

  // 检查是否有足够的 skills
  const installedSkills = fs.readdirSync(claudeSkillsDir)
    .filter(item => {
      const skillPath = path.join(claudeSkillsDir, item, 'SKILL.md')
      return fs.existsSync(skillPath)
    })

  return installedSkills.length >= SKILLS.length * 0.8 // 80% 已安装就算完成
}

/**
 * 安装 Skills
 */
async function installSkills() {
  try {
    Logger.info('正在安装 GLM Code 专业技能包...')

    // Claude Code 的 skills 目录
    const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills')

    // 当前项目中的 skills 目录
    const projectSkillsDir = path.join(__dirname, '..', '..', 'skills')

    // 检查项目 skills 目录是否存在
    if (!fs.existsSync(projectSkillsDir)) {
      Logger.warning('项目中的 skills 目录不存在，跳过 Skills 安装')
      return false
    }

    // 创建 Claude Code skills 目录
    ensureDir(claudeSkillsDir)

    let successCount = 0
    for (const skillName of SKILLS) {
      const srcSkillDir = path.join(projectSkillsDir, skillName)
      const destSkillDir = path.join(claudeSkillsDir, skillName)

      if (fs.existsSync(srcSkillDir)) {
        try {
          copyFile(srcSkillDir, destSkillDir)
          Logger.success(`安装技能: ${skillName}`)
          successCount++
        } catch (error) {
          Logger.warning(`安装技能失败: ${skillName} - ${error.message}`)
        }
      } else {
        Logger.warning(`跳过技能: ${skillName} (源目录不存在)`)
      }
    }

    // 复制 README.md
    const readmeSrc = path.join(projectSkillsDir, 'README.md')
    const readmeDest = path.join(claudeSkillsDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      try {
        fs.copyFileSync(readmeSrc, readmeDest)
        Logger.info('复制 Skills 说明文档')
      } catch (error) {
        Logger.warning(`复制说明文档失败: ${error.message}`)
      }
    }

    if (successCount > 0) {
      Logger.success(`专业技能包安装完成! 成功安装 ${successCount} 个技能`)
      return true
    } else {
      Logger.warning('未能安装任何技能')
      return false
    }

  } catch (error) {
    Logger.error(`Skills 安装失败: ${error.message}`)
    return false
  }
}

/**
 * 显示已安装的技能列表
 */
function showInstalledSkills() {
  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills')

  if (!fs.existsSync(claudeSkillsDir)) {
    Logger.info('尚未安装任何 Skills')
    return
  }

  const skills = fs.readdirSync(claudeSkillsDir)
    .filter(item => {
      const skillFile = path.join(claudeSkillsDir, item, 'SKILL.md')
      return fs.existsSync(skillFile)
    })

  if (skills.length === 0) {
    Logger.info('尚未安装任何 Skills')
    return
  }

  Logger.info(`已安装 ${skills.length} 个专业技能:`)

  skills.forEach(skill => {
    const skillFile = path.join(claudeSkillsDir, skill, 'SKILL.md')
    if (fs.existsSync(skillFile)) {
      try {
        const content = fs.readFileSync(skillFile, 'utf8')
        const nameMatch = content.match(/name:\s*(.+)/)
        const descMatch = content.match(/description:\s*(.+?)\./)
        const name = nameMatch ? nameMatch[1].trim() : skill
        const desc = descMatch ? descMatch[1].trim() : '专业能力技能'
        console.log(`  ✨ ${name} - ${desc}`)
      } catch (error) {
        console.log(`  ✨ ${skill} - 专业能力技能`)
      }
    }
  })
}

/**
 * 获取 Skills 安装状态
 */
function getSkillsStatus() {
  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills')

  if (!fs.existsSync(claudeSkillsDir)) {
    return { installed: false, count: 0, skills: [] }
  }

  const installedSkills = fs.readdirSync(claudeSkillsDir)
    .filter(item => {
      const skillPath = path.join(claudeSkillsDir, item, 'SKILL.md')
      return fs.existsSync(skillPath)
    })

  return {
    installed: installedSkills.length > 0,
    count: installedSkills.length,
    skills: installedSkills
  }
}

module.exports = {
  installSkills,
  areSkillsInstalled,
  showInstalledSkills,
  getSkillsStatus,
  SKILLS
}
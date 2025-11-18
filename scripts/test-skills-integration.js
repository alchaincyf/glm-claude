#!/usr/bin/env node

/**
 * GLM Code Skills 集成测试脚本
 * 验证 Skills 功能是否正常工作
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

// 引入 Skills 安装器
const { installSkills, areSkillsInstalled, getSkillsStatus, SKILLS } = require('../src/utils/skills-installer')

// 日志工具
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  header: (msg) => console.log(`\n🔍 ${msg}`)
}

/**
 * 检查文件是否存在
 */
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`)
    return true
  } else {
    log.error(`${description} 不存在: ${filePath}`)
    return false
  }
}

/**
 * 检查 Skills 文件格式
 */
function checkSkillFormat(skillDir, skillName) {
  const skillFile = path.join(skillDir, 'SKILL.md')

  if (!fs.existsSync(skillFile)) {
    log.error(`${skillName} 缺少 SKILL.md 文件`)
    return false
  }

  try {
    const content = fs.readFileSync(skillFile, 'utf8')

    // 检查 YAML frontmatter
    if (!content.match(/^---\s*\n.*?name:\s*\w+.*?description:\s*.+?\n.*?---/ms)) {
      log.error(`${skillName} SKILL.md 格式不正确，缺少 YAML frontmatter`)
      return false
    }

    // 检查必要字段
    const hasName = content.match(/name:\s*(.+)/)
    const hasDescription = content.match(/description:\s*(.+)/)

    if (!hasName || !hasDescription) {
      log.error(`${skillName} 缺少必要字段 (name 或 description)`)
      return false
    }

    log.success(`${skillName} 格式验证通过`)
    return true

  } catch (error) {
    log.error(`读取 ${skillName} 失败: ${error.message}`)
    return false
  }
}

/**
 * 测试 Skills 安装功能
 */
async function testSkillsInstallation() {
  log.header('测试 Skills 安装功能')

  try {
    const success = await installSkills()
    if (success) {
      log.success('Skills 安装功能正常')
      return true
    } else {
      log.error('Skills 安装失败')
      return false
    }
  } catch (error) {
    log.error(`Skills 安装测试失败: ${error.message}`)
    return false
  }
}

/**
 * 测试 Skills 检测功能
 */
function testSkillsDetection() {
  log.header('测试 Skills 检测功能')

  const isInstalled = areSkillsInstalled()
  const status = getSkillsStatus()

  log.info(`Skills 检测状态: ${isInstalled ? '已安装' : '未安装'}`)
  log.info(`已安装技能数量: ${status.count}`)
  log.info(`技能列表: ${status.skills.join(', ')}`)

  return true
}

/**
 * 测试 Skills 文件结构
 */
function testSkillsStructure() {
  log.header('测试 Skills 文件结构')

  let successCount = 0

  for (const skillName of SKILLS) {
    log.info(`检查技能: ${skillName}`)

    // 检查项目中的技能文件
    const projectSkillDir = path.join(__dirname, '..', 'skills', skillName)
    if (!checkFileExists(projectSkillDir, `项目技能目录 ${skillName}`)) {
      continue
    }

    // 检查技能格式
    if (checkSkillFormat(projectSkillDir, skillName)) {
      successCount++
    }
  }

  log.success(`文件结构测试完成: ${successCount}/${SKILLS.length} 个技能格式正确`)
  return successCount === SKILLS.length
}

/**
 * 测试目标目录权限
 */
function testTargetDirectory() {
  log.header('测试目标目录权限')

  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills')

  try {
    // 尝试创建目录
    if (!fs.existsSync(claudeSkillsDir)) {
      fs.mkdirSync(claudeSkillsDir, { recursive: true })
      log.success('目标目录创建成功')
    } else {
      log.success('目标目录已存在')
    }

    // 尝试写入测试文件
    const testFile = path.join(claudeSkillsDir, '.test-write')
    fs.writeFileSync(testFile, 'test')
    fs.unlinkSync(testFile)
    log.success('目标目录写入权限正常')

    return true

  } catch (error) {
    log.error(`目标目录权限测试失败: ${error.message}`)
    return false
  }
}

/**
 * 模拟用户使用流程
 */
async function testUserWorkflow() {
  log.header('测试用户使用流程')

  try {
    // 1. 模拟首次使用（Skills 未安装）
    log.info('模拟首次使用场景...')
    const firstInstall = await installSkills()

    // 2. 模拟再次使用（Skills 已安装）
    log.info('模拟再次使用场景...')
    const secondInstall = areSkillsInstalled()

    // 3. 检查状态
    const status = getSkillsStatus()

    if (firstInstall && secondInstall && status.installed) {
      log.success('用户使用流程测试通过')
      return true
    } else {
      log.error('用户使用流程测试失败')
      return false
    }

  } catch (error) {
    log.error(`用户工作流测试失败: ${error.message}`)
    return false
  }
}

/**
 * 生成测试报告
 */
function generateTestReport(results) {
  log.header('测试报告')

  const totalTests = Object.keys(results).length
  const passedTests = Object.values(results).filter(Boolean).length

  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试总结: ${passedTests}/${totalTests} 通过`)
  console.log('='.repeat(50))

  for (const [testName, passed] of Object.entries(results)) {
    const status = passed ? '✅ 通过' : '❌ 失败'
    console.log(`${status} ${testName}`)
  }

  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！Skills 集成功能正常工作')
    console.log('🚀 GLM Code 已准备好为用户提供专业能力')
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关问题')
  }

  console.log('\n📝 建议:')
  console.log('• 确保所有 Skills 文件格式正确')
  console.log('• 检查目标目录权限')
  console.log('• 验证安装脚本的执行权限')
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('🧪 GLM Code Skills 集成测试开始\n')

  const results = {}

  try {
    // 运行所有测试
    results['Skills 文件结构'] = testSkillsStructure()
    results['目标目录权限'] = testTargetDirectory()
    results['Skills 检测功能'] = testSkillsDetection()
    results['Skills 安装功能'] = await testSkillsInstallation()
    results['用户使用流程'] = await testUserWorkflow()

    // 生成报告
    generateTestReport(results)

  } catch (error) {
    log.error(`测试过程中发生错误: ${error.message}`)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runTests()
}

module.exports = { runTests }
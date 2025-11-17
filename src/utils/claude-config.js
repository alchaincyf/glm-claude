/**
 * Claude Code 配置管理
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

/**
 * 设置 GLM Code 品牌化的 CLAUDE.md
 * @param {string} targetDir - 目标目录（默认为当前目录）
 */
function setupClaudeMd(targetDir = process.cwd()) {
  try {
    // 确定 .claude 目录路径
    const claudeDir = path.join(targetDir, '.claude');
    const claudeMdPath = path.join(claudeDir, 'CLAUDE.md');

    // 检查是否已存在 CLAUDE.md
    if (fs.existsSync(claudeMdPath)) {
      // 已存在，不覆盖用户自定义的配置
      return { created: false, path: claudeMdPath };
    }

    // 读取模板文件
    const templatePath = path.join(__dirname, '../templates/CLAUDE.md');
    if (!fs.existsSync(templatePath)) {
      // 模板不存在，跳过
      return { created: false, error: 'Template not found' };
    }

    // 创建 .claude 目录（如果不存在）
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    // 复制模板到目标位置
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(claudeMdPath, templateContent, 'utf8');

    return { created: true, path: claudeMdPath };
  } catch (error) {
    // 静默失败，不影响主流程
    return { created: false, error: error.message };
  }
}

/**
 * 设置全局 CLAUDE.md（在用户主目录）
 */
function setupGlobalClaudeMd() {
  const homeDir = os.homedir();
  return setupClaudeMd(homeDir);
}

/**
 * 显示 CLAUDE.md 设置提示
 * @param {Object} result - setupClaudeMd 的返回结果
 */
function showSetupMessage(result) {
  if (result.created) {
    console.log(chalk.gray('📝 已创建 GLM Code 配置文件: .claude/CLAUDE.md'));
  }
}

module.exports = {
  setupClaudeMd,
  setupGlobalClaudeMd,
  showSetupMessage
};

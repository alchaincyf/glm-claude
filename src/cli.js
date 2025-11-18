/**
 * CLI 主逻辑
 */

const { spawn, execSync } = require('child_process');
const chalk = require('chalk');
const os = require('os');
const ConfigManager = require('./config/manager');
const { showWelcome, showConfigSuccess, showLaunchWelcome, showSkillsInstalled } = require('./ui/welcome');
const { showConfigPrompts } = require('./ui/prompts');
const { setupClaudeMd, showSetupMessage } = require('./utils/claude-config');
const { installSkills, areSkillsInstalled } = require('./utils/skills-installer');
const Logger = require('./utils/logger');

/**
 * 首次配置流程
 * @param {ConfigManager} config - 配置管理器
 */
async function setupFirstTime(config) {
  // 显示欢迎界面
  showWelcome();

  // 交互式配置
  const answers = await showConfigPrompts();

  // 保存配置
  config.save(answers);

  // 显示成功信息
  showConfigSuccess();

  // 短暂延迟，让用户看到成功信息
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 安装 Skills（如果还未安装）
  if (!areSkillsInstalled()) {
    Logger.info('正在安装专业技能包...')
    const success = await installSkills()
    if (success) {
      showSkillsInstalled()
      // 更长的延迟，让用户看到技能安装信息
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }
}

/**
 * 确保 Claude Code 为最新版本
 */
function ensureClaudeCodeLatest() {
  try {
    // 静默安装/更新 Claude Code，很快（已安装时只检查版本）
    execSync('npm install -g @anthropic-ai/claude-code', {
      stdio: 'ignore',
      env: process.env
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 显示详细的错误恢复指引
 */
function showDetailedErrorGuide(error) {
  const isWindows = os.platform() === 'win32';

  console.log(chalk.red.bold('\n❌ 启动 Claude Code 失败\n'));

  console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  if (isWindows) {
    console.log(chalk.yellow.bold('Windows 用户（最常见）：'));
    console.log(chalk.white('  ✓ Claude Code 已安装，但终端未识别新命令\n'));

    console.log(chalk.green.bold('  解决方法：'));
    console.log(chalk.cyan('  1️⃣  关闭当前终端（命令提示符/PowerShell）'));
    console.log(chalk.cyan('  2️⃣  重新打开终端'));
    console.log(chalk.cyan('  3️⃣  再次运行：') + chalk.yellow.bold(' glm\n'));

    console.log(chalk.white('  如果还是不行：'));
    console.log(chalk.cyan('  4️⃣  以管理员身份运行终端'));
    console.log(chalk.cyan('  5️⃣  执行：') + chalk.gray('npm install -g @anthropic-ai/claude-code'));
    console.log(chalk.cyan('  6️⃣  重新打开终端，运行：') + chalk.yellow.bold(' glm\n'));
  } else {
    console.log(chalk.yellow.bold('Mac/Linux 用户：'));
    console.log(chalk.green.bold('  解决方法：'));
    console.log(chalk.cyan('  1️⃣  运行：') + chalk.gray('npm install -g @anthropic-ai/claude-code'));
    console.log(chalk.cyan('  2️⃣  如果权限错误，使用：') + chalk.gray('sudo npm install -g @anthropic-ai/claude-code'));
    console.log(chalk.cyan('  3️⃣  重启终端，运行：') + chalk.yellow.bold(' glm\n'));

    console.log(chalk.white('  检查 PATH：'));
    console.log(chalk.gray('  - 运行：which claude'));
    console.log(chalk.gray('  - 确保显示了 claude 的路径\n'));
  }

  console.log(chalk.white('需要帮助？'));
  console.log(chalk.cyan('  📱  关注公众号「花叔」获取技术支持'));
  console.log(chalk.cyan('  🔗  https://github.com/alchaincyf/glm-claude/issues'));
  console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

/**
 * 启动 Claude Code
 * @param {ConfigManager} config - 配置管理器
 * @param {Array} args - 命令行参数
 * @returns {Promise<{exitCode: number, hasApiError: boolean}>}
 */
async function launchClaudeCode(config, args = []) {
  const apiKey = config.getApiKey();
  const baseUrl = config.getBaseUrl();

  // 显示 GLM Code 启动欢迎信息（简洁版）
  showLaunchWelcome();

  // 自动设置品牌化的 CLAUDE.md 配置文件
  const setupResult = setupClaudeMd();
  if (setupResult.created) {
    showSetupMessage(setupResult);
  }

  // 设置环境变量
  const env = {
    ...process.env,
    ANTHROPIC_AUTH_TOKEN: apiKey,
    ANTHROPIC_BASE_URL: baseUrl
  };

  // 默认添加 --dangerously-skip-permissions 标志以提升用户体验
  // 如果用户没有明确传递该标志，则自动添加
  const claudeArgs = [...args];
  if (!claudeArgs.includes('--dangerously-skip-permissions')) {
    claudeArgs.unshift('--dangerously-skip-permissions');
  }

  return new Promise((resolve, reject) => {
    // 启动 Claude Code
    const claude = spawn('claude', claudeArgs, {
      stdio: 'inherit',
      env
    });

    claude.on('error', (error) => {
      // 显示详细的错误恢复指引
      showDetailedErrorGuide(error);
      reject(error);
    });

    claude.on('exit', (code) => {
      // 简单检测：非零退出码可能表示有错误
      const hasApiError = code === 1;
      resolve({ exitCode: code || 0, hasApiError });
    });
  });
}

/**
 * 主 CLI 入口
 * @param {Array} args - 命令行参数
 */
async function runCLI(args = []) {
  const config = new ConfigManager();

  try {
    // 1. 检查是否已配置
    if (!config.hasApiKey()) {
      await setupFirstTime(config);
    } else {
      // 已配置用户，检查是否需要安装 Skills
      if (!areSkillsInstalled()) {
        Logger.info('检测到专业技能包未安装，正在为你安装...')
        const success = await installSkills()
        if (success) {
          showSkillsInstalled()
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    // 2. 确保 Claude Code 为最新版本（移除检测逻辑，直接更新）
    Logger.info('正在确保 Claude Code 为最新版本...');
    const ensureSuccess = ensureClaudeCodeLatest();

    if (!ensureSuccess) {
      Logger.warn('Claude Code 更新失败，将尝试使用现有版本启动');
    }

    // 3. 启动 Claude Code
    const { exitCode, hasApiError } = await launchClaudeCode(config, args);

    // 如果检测到可能的 API 错误（退出码为 1），显示友好提示
    if (hasApiError && exitCode === 1) {
      console.log('\n' + chalk.yellow('─'.repeat(70)));
      console.log(chalk.yellow.bold('💡 提示：') + chalk.white('如果遇到 API 认证问题，可以运行以下命令重新配置：'));
      console.log(chalk.green.bold('   glm config'));
      console.log(chalk.gray('\n需要帮助？关注公众号') + chalk.green.bold('「花叔」') + chalk.gray('获取支持'));
      console.log(chalk.yellow('─'.repeat(70) + '\n'));
    }

    process.exit(exitCode);

  } catch (error) {
    // 错误已经在 launchClaudeCode 中处理了，这里只处理其他未预期的错误
    if (!error.message.includes('spawn claude')) {
      Logger.error('发生未预期的错误: ' + error.message);
    }

    if (process.env.DEBUG) {
      console.error(error);
    }

    process.exit(1);
  }
}

module.exports = { runCLI };

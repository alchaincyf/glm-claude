/**
 * CLI 主逻辑
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const ConfigManager = require('./config/manager');
const { showWelcome, showConfigSuccess, showLaunchWelcome } = require('./ui/welcome');
const { showConfigPrompts } = require('./ui/prompts');
const { checkClaudeInstallation } = require('./utils/installer');
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
      Logger.error('启动 Claude Code 失败');
      console.error(chalk.red(error.message));
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
    }

    // 2. 验证 Claude Code 是否已安装
    await checkClaudeInstallation();

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
    Logger.error('发生错误: ' + error.message);

    if (process.env.DEBUG) {
      console.error(error);
    }

    process.exit(1);
  }
}

module.exports = { runCLI };

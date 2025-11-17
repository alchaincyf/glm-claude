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
 */
async function launchClaudeCode(config, args = []) {
  const apiKey = config.getApiKey();
  const baseUrl = config.getBaseUrl();

  // 显示 GLM Code 启动欢迎信息
  showLaunchWelcome();

  Logger.info('正在启动 Claude Code...\n');

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

  // 启动 Claude Code
  const claude = spawn('claude', claudeArgs, {
    stdio: 'inherit',
    env
  });

  claude.on('error', (error) => {
    Logger.error('启动 Claude Code 失败');
    console.error(chalk.red(error.message));
    process.exit(1);
  });

  claude.on('exit', (code) => {
    process.exit(code || 0);
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

    // 3. 设置环境变量并启动 Claude Code
    await launchClaudeCode(config, args);

  } catch (error) {
    Logger.error('发生错误: ' + error.message);

    if (process.env.DEBUG) {
      console.error(error);
    }

    process.exit(1);
  }
}

module.exports = { runCLI };

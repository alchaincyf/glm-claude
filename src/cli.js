/**
 * CLI 主逻辑
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
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
    // 启动 Claude Code，使用管道捕获输出以监控 API 错误
    const claude = spawn('claude', claudeArgs, {
      stdio: ['inherit', 'pipe', 'pipe'],
      env
    });

    let hasApiError = false;
    let errorBuffer = '';

    // 监控标准输出
    claude.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(data);

      // 检测 API 认证错误
      if (output.includes('401') || output.includes('令牌已过期') || output.includes('验证不正确')) {
        hasApiError = true;
        errorBuffer += output;
      }
    });

    // 监控标准错误输出
    claude.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(data);

      // 检测 API 认证错误
      if (output.includes('401') || output.includes('令牌已过期') || output.includes('验证不正确')) {
        hasApiError = true;
        errorBuffer += output;
      }
    });

    claude.on('error', (error) => {
      Logger.error('启动 Claude Code 失败');
      console.error(chalk.red(error.message));
      reject(error);
    });

    claude.on('exit', (code) => {
      resolve({ exitCode: code || 0, hasApiError });
    });
  });
}

/**
 * 显示 API 错误后的引导信息并询问是否重新配置
 * @param {ConfigManager} config - 配置管理器
 * @returns {Promise<boolean>} - 是否需要重新配置
 */
async function showApiErrorGuide(config) {
  console.log('\n' + chalk.bgRed.white.bold(' ⚠️  API 认证失败 ') + '\n');
  console.log(chalk.red.bold('❌ API Key 验证失败') + chalk.gray('，可能的原因：'));
  console.log(chalk.gray('   • API Key 已过期或被撤销'));
  console.log(chalk.gray('   • API Key 输入错误'));
  console.log(chalk.gray('   • 账户余额不足或订阅已过期\n'));

  console.log(chalk.cyan.bold('💡 你可以：\n'));
  console.log(chalk.yellow('1️⃣  ') + chalk.white('立即重新配置 API Key（推荐）'));
  console.log(chalk.yellow('2️⃣  ') + chalk.white('检查订阅状态: ') + chalk.cyan('https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR'));
  console.log(chalk.yellow('3️⃣  ') + chalk.white('获取新 API Key: ') + chalk.cyan('https://bigmodel.cn/usercenter/proj-mgmt/apikeys\n'));

  const { shouldReconfig } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldReconfig',
      message: '是否现在重新配置 API Key？',
      default: true
    }
  ]);

  if (shouldReconfig) {
    console.log('');
    // 重置配置
    config.reset();
    // 重新进行配置
    const answers = await showConfigPrompts();
    config.save(answers);
    showConfigSuccess();
    console.log('');
    return true;
  } else {
    console.log('');
    console.log(chalk.gray('─'.repeat(70)));
    console.log(chalk.white('稍后可运行 ') + chalk.green.bold('glm config') + chalk.white(' 重新配置'));
    console.log(chalk.white('需要帮助？关注公众号 ') + chalk.green.bold('「花叔」') + chalk.white(' 获取支持'));
    console.log(chalk.gray('─'.repeat(70) + '\n'));
    return false;
  }
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

    // 3. 启动 Claude Code（可能需要循环处理 API 错误）
    let retry = true;
    while (retry) {
      const { exitCode, hasApiError } = await launchClaudeCode(config, args);

      // 如果有 API 错误，显示引导并询问是否重新配置
      if (hasApiError) {
        const reconfigured = await showApiErrorGuide(config);

        if (reconfigured) {
          // 重新配置成功，询问是否重新启动
          const { shouldRelaunch } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'shouldRelaunch',
              message: '配置已更新，是否重新启动 GLM Code？',
              default: true
            }
          ]);

          if (shouldRelaunch) {
            console.log('');
            retry = true;
            continue;
          }
        }
      }

      // 正常退出或用户选择不重试
      retry = false;
      process.exit(exitCode);
    }

  } catch (error) {
    Logger.error('发生错误: ' + error.message);

    if (process.env.DEBUG) {
      console.error(error);
    }

    process.exit(1);
  }
}

module.exports = { runCLI };

#!/usr/bin/env node

/**
 * 安装后脚本
 * 1. 自动安装 Claude Code
 * 2. 显示安装成功信息和快速开始指南
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');

// 检查依赖是否已安装
try {
  var chalk = require('chalk');
  var boxen = require('boxen');
} catch (error) {
  // 依赖还未安装完成，静默退出
  process.exit(0);
}

/**
 * 检查命令是否存在
 */
function commandExists(command) {
  try {
    const result = spawnSync(
      process.platform === 'win32' ? 'where' : 'which',
      [command],
      { stdio: 'pipe' }
    );
    return result.status === 0;
  } catch (error) {
    return false;
  }
}

/**
 * 检查是否是全局安装
 */
function isGlobalInstall() {
  // 检查安装路径中是否包含全局 node_modules 路径
  const installPath = __dirname;
  return installPath.includes('node_modules') &&
         (installPath.includes('/lib/node_modules/') ||
          installPath.includes('\\node_modules\\') ||
          process.env.npm_config_global === 'true');
}

/**
 * 自动安装 Claude Code
 */
async function installClaudeCode() {
  // 如果 claude 命令已存在，跳过安装
  if (commandExists('claude')) {
    console.log(chalk.green('✓ Claude Code 已安装'));
    return true;
  }

  // 只在全局安装时才自动安装 Claude Code
  if (!isGlobalInstall()) {
    console.log(chalk.yellow('⚠️  检测到本地安装，Claude Code 需要全局安装'));
    console.log(chalk.gray('   请运行: npm install -g glm-claude\n'));
    return false;
  }

  console.log(chalk.cyan('\n📦 正在安装 Claude Code...'));
  console.log(chalk.gray('   这可能需要几分钟时间，请耐心等待...\n'));

  try {
    // 使用 npm install -g 安装 Claude Code
    execSync('npm install -g @anthropic-ai/claude-code', {
      stdio: 'inherit', // 显示安装进度
      env: process.env
    });

    console.log(chalk.green('\n✅ Claude Code 安装成功!\n'));
    return true;
  } catch (error) {
    console.log(chalk.red('\n❌ Claude Code 自动安装失败'));
    console.log(chalk.yellow('\n请手动安装:'));
    console.log(chalk.cyan('   npm install -g @anthropic-ai/claude-code\n'));
    console.log(chalk.gray('安装完成后再运行 glm 即可使用\n'));
    return false;
  }
}

// 主流程
(async function() {
  // 先安装 Claude Code
  await installClaudeCode();

  // 显示欢迎信息
  const message =
    chalk.green.bold('✅ GLM Code 安装成功!') + '\n\n' +
    chalk.cyan.bold('快速开始:') + '\n' +
    chalk.gray('  1. 在任意项目目录运行: ') + chalk.yellow('glm') + '\n' +
    chalk.gray('  2. 首次使用会引导你配置 API Key\n') +
    chalk.gray('  3. 开始享受 AI 编程的乐趣!\n\n') +
    chalk.cyan.bold('💰 订阅 GLM 服务（推荐）:') + '\n' +
    chalk.green('  低至 20 元/月，仅为 Claude 官方价格的 1/7\n') +
    chalk.yellow('  订阅链接: ') + chalk.cyan('https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR') + '\n\n' +
    chalk.cyan.bold('或使用免费额度:') + '\n' +
    chalk.gray('  访问 ') + chalk.cyan('https://open.bigmodel.cn/') + chalk.gray(' 注册获取\n\n') +
    chalk.cyan.bold('查看帮助:') + '\n' +
    chalk.gray('  运行 ') + chalk.yellow('glm --help') + chalk.gray(' 查看所有命令\n\n') +
    chalk.cyan.bold('配置管理:') + '\n' +
    chalk.gray('  ') + chalk.yellow('glm config --show') + chalk.gray('   显示当前配置\n') +
    chalk.gray('  ') + chalk.yellow('glm config --reset') + chalk.gray('  重置配置');

  console.log('\n' + boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  }));

  console.log(chalk.gray('\n感谢使用 GLM Code! 问题反馈：公众号「花叔」\n'));
})();

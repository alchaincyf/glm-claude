/**
 * Claude Code 安装检查和自动安装
 */

const { execSync, spawnSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

/**
 * 检查命令是否存在
 * @param {string} command - 命令名
 * @returns {boolean}
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
 * 检查 Claude Code 是否已安装
 * 如果未安装，提示用户安装
 * @returns {Promise<boolean>}
 */
async function checkClaudeInstallation() {
  if (commandExists('claude')) {
    return true;
  }

  console.log(chalk.yellow('\n⚠️  未检测到 Claude Code'));
  console.log(chalk.gray('Claude Code 是运行所需的核心依赖\n'));

  const inquirer = require('inquirer');
  const { shouldInstall } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldInstall',
      message: '是否自动安装 Claude Code?',
      default: true
    }
  ]);

  if (!shouldInstall) {
    console.log(chalk.yellow('\n请手动安装 Claude Code:'));
    console.log(chalk.cyan('  npm install -g @anthropic-ai/claude-code\n'));
    process.exit(0);
  }

  const spinner = ora('正在安装 Claude Code...').start();

  try {
    // 自动安装 Claude Code
    execSync('npm install -g @anthropic-ai/claude-code', {
      stdio: 'pipe'
    });

    spinner.succeed(chalk.green('Claude Code 安装成功!'));
    return true;
  } catch (error) {
    spinner.fail(chalk.red('Claude Code 安装失败'));
    console.error(chalk.red('\n错误信息:'), error.message);
    console.log(chalk.yellow('\n请尝试手动安装:'));
    console.log(chalk.cyan('  npm install -g @anthropic-ai/claude-code\n'));
    process.exit(1);
  }
}

module.exports = {
  checkClaudeInstallation,
  commandExists
};

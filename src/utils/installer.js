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
 * 如果未安装，自动安装（不再询问用户）
 * @returns {Promise<boolean>}
 */
async function checkClaudeInstallation() {
  if (commandExists('claude')) {
    return true;
  }

  console.log(chalk.yellow('\n⚠️  未检测到 Claude Code'));
  console.log(chalk.gray('正在自动安装 Claude Code...'));
  console.log(chalk.gray('这可能需要几分钟时间，请耐心等待...\n'));

  const spinner = ora('正在安装 Claude Code').start();

  try {
    // 自动安装 Claude Code，显示安装进度
    execSync('npm install -g @anthropic-ai/claude-code', {
      stdio: ['inherit', 'inherit', 'inherit'], // 显示安装输出
      env: process.env
    });

    spinner.succeed(chalk.green('Claude Code 安装成功!'));
    console.log('');
    return true;
  } catch (error) {
    spinner.fail(chalk.red('Claude Code 自动安装失败'));
    console.log('');
    console.log(chalk.red('错误信息:'), error.message);
    console.log('');
    console.log(chalk.yellow('━'.repeat(70)));
    console.log(chalk.yellow.bold('💡 解决方法：'));
    console.log('');
    console.log(chalk.white('1️⃣  手动安装 Claude Code:'));
    console.log(chalk.cyan('    npm install -g @anthropic-ai/claude-code'));
    console.log('');
    console.log(chalk.white('2️⃣  检查网络连接和 npm 权限'));
    console.log(chalk.gray('    Windows: 以管理员身份运行命令提示符'));
    console.log(chalk.gray('    Mac/Linux: 使用 sudo 或配置 npm 全局目录权限'));
    console.log('');
    console.log(chalk.white('3️⃣  需要帮助？'));
    console.log(chalk.gray('    关注公众号') + chalk.green.bold('「花叔」') + chalk.gray('获取技术支持'));
    console.log(chalk.yellow('━'.repeat(70)));
    console.log('');
    process.exit(1);
  }
}

module.exports = {
  checkClaudeInstallation,
  commandExists
};

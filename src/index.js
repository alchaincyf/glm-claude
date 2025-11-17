/**
 * GLM Claude - 主入口文件
 * 智谱 GLM 驱动的 Claude Code
 */

const chalk = require('chalk');
const ConfigManager = require('./config/manager');
const { runCLI } = require('./cli');
const { confirmReconfigure } = require('./ui/prompts');
const Logger = require('./utils/logger');
const packageJson = require('../package.json');

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(chalk.cyan.bold('\nGLM Claude v' + packageJson.version));
  console.log(chalk.gray(packageJson.description + '\n'));
  console.log(chalk.white('用法:'));
  console.log(chalk.gray('  glm                    ') + '启动 Claude Code（使用 GLM 模型）');
  console.log(chalk.gray('  glm config             ') + '重新配置 API Key');
  console.log(chalk.gray('  glm config --show      ') + '显示当前配置');
  console.log(chalk.gray('  glm config --reset     ') + '重置所有配置');
  console.log(chalk.gray('  glm -v, --version      ') + '显示版本号');
  console.log(chalk.gray('  glm -h, --help         ') + '显示此帮助信息\n');
  console.log(chalk.white('其他选项将传递给 Claude Code\n'));
}

/**
 * 处理 config 命令
 */
async function handleConfigCommand(args) {
  const config = new ConfigManager();

  if (args.includes('--reset')) {
    // 重置配置
    if (config.hasApiKey()) {
      const confirmed = await confirmReconfigure();
      if (confirmed) {
        config.reset();
        Logger.success('配置已重置');
        Logger.info('下次运行 glm 时将重新配置');
      } else {
        Logger.info('已取消');
      }
    } else {
      Logger.warning('当前没有配置');
    }
  } else if (args.includes('--show')) {
    // 显示配置
    if (config.hasApiKey()) {
      const safeConfig = config.getSafeConfig();
      console.log(chalk.cyan('\n当前配置:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.white('API Key:      ') + chalk.yellow(safeConfig.apiKey));
      console.log(chalk.white('Base URL:     ') + chalk.gray(safeConfig.baseUrl));
      console.log(chalk.white('默认模型:      ') + chalk.green(safeConfig.defaultModel));
      console.log(chalk.white('配置时间:      ') + chalk.gray(new Date(safeConfig.configuredAt).toLocaleString('zh-CN')));
      console.log(chalk.white('配置文件:      ') + chalk.gray(config.getConfigPath()));
      console.log(chalk.gray('─'.repeat(50) + '\n'));
    } else {
      Logger.warning('当前没有配置');
      Logger.info('运行 glm 开始配置');
    }
  } else {
    // 重新配置
    if (config.hasApiKey()) {
      const confirmed = await confirmReconfigure();
      if (!confirmed) {
        Logger.info('已取消');
        process.exit(0);
      }
      config.reset();
    }
    await runCLI();
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    const args = process.argv.slice(2);

    // 处理帮助命令
    if (args.includes('-h') || args.includes('--help')) {
      showHelp();
      return;
    }

    // 处理版本命令
    if (args.includes('-v') || args.includes('--version')) {
      console.log('GLM Claude v' + packageJson.version);
      return;
    }

    // 处理 config 命令
    if (args[0] === 'config') {
      await handleConfigCommand(args);
      return;
    }

    // 默认: 启动 Claude Code
    await runCLI(args);

  } catch (error) {
    Logger.error('程序执行失败: ' + error.message);

    if (process.env.DEBUG) {
      console.error(error);
    }

    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = { main };
